import fs from 'fs';
import path from 'path';

const metadataPath = path.resolve('src/data/character_metadata.json');
const raw = fs.readFileSync(metadataPath, 'utf-8');
const data = JSON.parse(raw);

for (const entry of Object.values(data)) {
  delete entry.elementIcon;
  delete entry.weaponIcon;
  delete entry.burstIcon;
  delete entry.classIcon;
}

fs.writeFileSync(metadataPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
console.log('Icon fields removed from character_metadata.json');
