// Packages the Electron app into dist/Hermes Netrunner-win32-x64 (input for the Inno Setup script).
const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

const ROOT = path.join(__dirname, '..');

(async () => {
  const { packager } = await import('@electron/packager');
  const [out] = await packager({
    dir: ROOT,
    out: path.join(ROOT, 'dist'),
    name: pkg.productName,
    executableName: 'HermesNetrunner',
    platform: 'win32',
    arch: 'x64',
    icon: path.join(ROOT, 'build', 'icon.ico'),
    appVersion: pkg.version,
    buildVersion: pkg.version,
    appCopyright: `Copyright © ${new Date().getFullYear()} ${pkg.author}`,
    win32metadata: {
      CompanyName: pkg.author,
      FileDescription: pkg.productName,
      ProductName: pkg.productName,
      InternalName: 'HermesNetrunner',
      OriginalFilename: 'HermesNetrunner.exe',
    },
    asar: true,
    overwrite: true,
    prune: true,
    // only the runtime files go into the package
    ignore: [/^\/(dist|installer|scripts|src|node_modules\/\.cache)(\/|$)/, /^\/build\/(?!icon\.ico$)/, /\.md$/, /^\/LICENSE$/, /^\/\.git/],
  });
  // The game UI is English-only: drop Chromium's other UI locales (~48 MB).
  const locales = path.join(out, 'locales');
  for (const f of fs.readdirSync(locales)) if (f !== 'en-US.pak') fs.rmSync(path.join(locales, f));
  console.log('packaged ->', path.relative(ROOT, out));
})().catch(err => { console.error(err); process.exit(1); });
