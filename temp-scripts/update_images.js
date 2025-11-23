import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const htmlPath = path.resolve('characterList.html');
const metadataPath = path.resolve('src/data/character_metadata.json');

// Load HTML and parse with JSDOM
const html = fs.readFileSync(htmlPath, 'utf-8');
const dom = new JSDOM(html);
const document = dom.window.document;

// Build a map of character name -> image URL (src of .nikkes-player-item-img)
const nameToImg = {};
const items = document.querySelectorAll('[data-cname="player-item"]');
items.forEach(item => {
  const nameElem = item.querySelector('.name span') || item.querySelector('.name');
  const name = nameElem?.textContent?.trim();
  const imgElem = item.querySelector('.nikkes-player-item-img');
  const imgSrc = imgElem?.getAttribute('src') ?? '';
  if (name && imgSrc) {
    nameToImg[name] = imgSrc;
  }
});

// Load existing metadata
const raw = fs.readFileSync(metadataPath, 'utf-8');
const data = JSON.parse(raw);

// Update imageUrl for each entry based on name match
for (const [key, entry] of Object.entries(data)) {
  const name = entry.name;
  if (name && nameToImg[name]) {
    entry.imageUrl = nameToImg[name];
  }
}

// Write back formatted JSON
fs.writeFileSync(metadataPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
console.log('Image URLs updated from characterList.html');
