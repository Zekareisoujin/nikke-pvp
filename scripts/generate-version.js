import fs from 'fs';
import path from 'path';

const version = new Date().getTime().toString();
const versionData = { version };

// Ensure public directory exists
const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Write public/version.json
fs.writeFileSync(
  path.join(publicDir, 'version.json'),
  JSON.stringify(versionData, null, 2)
);

// Write src/version.ts
const srcDir = path.resolve('src');
if (!fs.existsSync(srcDir)) {
  fs.mkdirSync(srcDir);
}

fs.writeFileSync(
  path.join(srcDir, 'version.ts'),
  `export const BUILD_VERSION = '${version}';\n`
);

console.log(`Generated version: ${version}`);
