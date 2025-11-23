import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const htmlPath = path.resolve('characterList.html');
const metadataPath = path.resolve('src/data/character_metadata.json');

const html = fs.readFileSync(htmlPath, 'utf-8');
const dom = new JSDOM(html);
const document = dom.window.document;

// Map name -> icons
const iconMap = {};
const items = document.querySelectorAll('[data-cname="player-item"]');
items.forEach(item => {
  const nameElem = item.querySelector('.name span') || item.querySelector('.name');
  const name = nameElem?.textContent?.trim();
  if (!name) return;
  const elementImg = item.querySelector('.icon-code');
  const weaponImg = item.querySelector('.icon-weapon');
  const burstImg = item.querySelector('.icon-burst img'); // burst icon image
  const jobImg = item.querySelector('.job');
  iconMap[name] = {
    elementIcon: elementImg?.src ?? '',
    weaponIcon: weaponImg?.src ?? '',
    burstIcon: burstImg?.src ?? '',
    classIcon: jobImg?.src ?? ''
  };
});

// Load existing metadata
const raw = fs.readFileSync(metadataPath, 'utf-8');
const data = JSON.parse(raw);

for (const [key, entry] of Object.entries(data)) {
  const name = entry.name;
  if (name && iconMap[name]) {
    const icons = iconMap[name];
    entry.elementIcon = icons.elementIcon;
    entry.weaponIcon = icons.weaponIcon;
    entry.burstIcon = icons.burstIcon;
    entry.classIcon = icons.classIcon;
  }
}

fs.writeFileSync(metadataPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
console.log('Icon URLs added to metadata');
