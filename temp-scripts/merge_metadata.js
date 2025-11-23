import fs from 'fs';
import path from 'path';

const metadataPath = path.resolve('src/data/character_metadata.json');
const raw = fs.readFileSync(metadataPath, 'utf-8');
const data = JSON.parse(raw);

// Helper to check if a key is numeric (ID)
const isNumericKey = (k) => /^\d+$/.test(k);

let maxId = 0;
for (const k of Object.keys(data)) {
  if (isNumericKey(k)) {
    const id = parseInt(k, 10);
    if (id > maxId) maxId = id;
  }
}

// Merge name-keyed entries into ID-keyed entries
for (const [key, entry] of Object.entries({ ...data })) {
  if (!isNumericKey(key)) {
    const name = key;
    // Find matching ID entry by name
    const matchingId = Object.entries(data).find(([k, v]) => isNumericKey(k) && v.name === name);
    if (matchingId) {
      const [idKey, idEntry] = matchingId;
      // Merge fields (prefer existing ID entry values, but fill missing)
      const merged = { ...idEntry, ...entry };
      // Ensure name field is present
      merged.name = name;
      data[idKey] = merged;
    } else {
      // No existing ID entry, create a new one
      maxId += 1;
      const newId = String(maxId);
      data[newId] = { name, ...entry };
    }
    // Delete the name-keyed entry
    delete data[key];
  }
}

// Remove combat field from all entries (if present)
for (const entry of Object.values(data)) {
  if ('combat' in entry) {
    delete entry.combat;
  }
}

// Write back formatted JSON
fs.writeFileSync(metadataPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
console.log('Metadata merged and combat field removed.');
