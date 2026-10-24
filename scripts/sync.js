// Builds app/index.html from src/hermes-netrunner.html by wrapping the page in a full HTML document.
// The page uses system fonts only, so the app runs fully offline with nothing else to copy.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const APP = path.join(ROOT, 'app');

fs.rmSync(APP, { recursive: true, force: true });
fs.mkdirSync(APP, { recursive: true });

const page = fs.readFileSync(path.join(ROOT, 'src', 'hermes-netrunner.html'), 'utf8');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:">
<style>[hidden]{display:none!important}img{max-width:100%}</style>
</head>
<body>
${page}
</body>
</html>
`;
fs.writeFileSync(path.join(APP, 'index.html'), html);
console.log('synced -> app/index.html');
