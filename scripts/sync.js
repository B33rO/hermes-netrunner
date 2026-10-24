// Builds app/ from src/hermes-netrunner.html: wraps the page in a full HTML document and swaps the
// Google Fonts link for the bundled fonts, so the desktop app runs fully offline.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const APP = path.join(ROOT, 'app');
const FONTS = path.join(ROOT, 'fonts');

const faces = [
  ['Chakra Petch', 400, 'ChakraPetch-Regular.ttf'],
  ['Chakra Petch', 600, 'ChakraPetch-SemiBold.ttf'],
  ['Chakra Petch', 700, 'ChakraPetch-Bold.ttf'],
  ['Share Tech Mono', 400, 'ShareTechMono-Regular.ttf'],
  ['Saira Condensed', 500, 'SairaCondensed-Medium.ttf'],
  ['Saira Condensed', 700, 'SairaCondensed-Bold.ttf'],
  ['Saira Condensed', 800, 'SairaCondensed-ExtraBold.ttf'],
];

fs.rmSync(APP, { recursive: true, force: true });
fs.mkdirSync(path.join(APP, 'fonts'), { recursive: true });
for (const [, , file] of faces) fs.copyFileSync(path.join(FONTS, file), path.join(APP, 'fonts', file));
fs.writeFileSync(path.join(APP, 'fonts.css'), faces.map(([fam, w, file]) =>
  `@font-face{font-family:"${fam}";font-weight:${w};font-style:normal;font-display:swap;src:url("fonts/${file}") format("truetype")}`).join('\n') + '\n');

let page = fs.readFileSync(path.join(ROOT, 'src', 'hermes-netrunner.html'), 'utf8');
page = page.replace(/<link rel="preconnect"[^>]*>\s*/g, '')
  .replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/, '<link rel="stylesheet" href="fonts.css">');
if (/fonts\.googleapis/.test(page)) throw new Error('Google Fonts link not replaced');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'">
<style>[hidden]{display:none!important}img{max-width:100%}</style>
</head>
<body>
${page}
</body>
</html>
`;
fs.writeFileSync(path.join(APP, 'index.html'), html);
console.log('synced -> app/index.html');
