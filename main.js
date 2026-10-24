const { app, BrowserWindow, protocol, net, shell, screen } = require('electron');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

const APP_DIR = path.join(__dirname, 'app');
const START_URL = 'netrunner://app/index.html';

// A fixed custom origin keeps localStorage (XP, streak, node levels) stable across launches and updates.
protocol.registerSchemesAsPrivileged([
  { scheme: 'netrunner', privileges: { standard: true, secure: true, supportFetchAPI: true } },
]);

if (process.env.NETRUNNER_USER_DATA) app.setPath('userData', process.env.NETRUNNER_USER_DATA);
if (!app.requestSingleInstanceLock()) app.exit(0);

let win = null;

const prefsFile = () => path.join(app.getPath('userData'), 'window.json');
function readBounds() {
  try { return JSON.parse(fs.readFileSync(prefsFile(), 'utf8')); } catch { return null; }
}
function onScreen(b) {
  return b && screen.getAllDisplays().some(({ workArea: a }) =>
    b.x < a.x + a.width - 50 && b.x + b.width > a.x + 50 && b.y >= a.y - 10 && b.y < a.y + a.height - 50);
}

function createWindow() {
  const saved = readBounds();
  win = new BrowserWindow({
    ...(onScreen(saved) ? saved : { width: 860, height: 980 }),
    minWidth: 420,
    minHeight: 600,
    show: false,
    backgroundColor: '#07040f',
    title: 'Hermes Netrunner',
    icon: path.join(__dirname, 'build', 'icon.ico'),
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  win.removeMenu();
  win.once('ready-to-show', () => win.show());
  win.on('close', () => {
    try { fs.writeFileSync(prefsFile(), JSON.stringify(win.getNormalBounds())); } catch {}
  });
  // External links open in the default browser; the game itself never navigates away.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('netrunner://')) { e.preventDefault(); if (/^https?:/.test(url)) shell.openExternal(url); }
  });
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type === 'keyDown' && (input.key === 'F11')) { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
  });
  win.loadURL(START_URL);
}

app.on('second-instance', () => {
  if (win) { if (win.isMinimized()) win.restore(); win.focus(); }
});

app.whenReady().then(() => {
  protocol.handle('netrunner', req => {
    const rel = decodeURIComponent(new URL(req.url).pathname).replace(/^\/+/, '');
    const file = path.normalize(path.join(APP_DIR, rel));
    if (!file.startsWith(APP_DIR)) return new Response('Not found', { status: 404 });
    return net.fetch(pathToFileURL(file).toString());
  });
  createWindow();
});

app.on('window-all-closed', () => app.quit());
