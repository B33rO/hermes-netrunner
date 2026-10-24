// Compiles installer/hermes-netrunner.iss with Inno Setup 6 -> dist/installer/HermesNetrunner-Setup-<version>.exe
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

const ROOT = path.join(__dirname, '..');
const candidates = [
  process.env.ISCC,
  path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Inno Setup 6', 'ISCC.exe'),
  path.join(process.env['ProgramFiles(x86)'] || '', 'Inno Setup 6', 'ISCC.exe'),
  path.join(process.env.ProgramFiles || '', 'Inno Setup 6', 'ISCC.exe'),
].filter(Boolean);
const iscc = candidates.find(p => fs.existsSync(p));
if (!iscc) {
  console.error('Inno Setup 6 not found. Install it with:\n  winget install --id JRSoftware.InnoSetup -e --scope user\nor set ISCC to the path of ISCC.exe');
  process.exit(1);
}
if (!fs.existsSync(path.join(ROOT, 'dist', pkg.productName + '-win32-x64'))) {
  console.error('dist/' + pkg.productName + '-win32-x64 is missing - run "npm run pack" first');
  process.exit(1);
}

execFileSync(iscc, [
  '/Qp',
  '/DAppVersion=' + pkg.version,
  '/DAppPublisher=' + pkg.author,
  path.join(ROOT, 'installer', 'hermes-netrunner.iss'),
], { stdio: 'inherit' });
