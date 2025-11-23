import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const htmlPath = path.resolve('characterList.html');
const iconsPath = path.resolve('src/data/character_icons.json');

const html = fs.readFileSync(htmlPath, 'utf-8');
const dom = new JSDOM(html);
const document = dom.window.document;

const iconMap = {};
const items = document.querySelectorAll('[data-cname="player-item"]');
items.forEach(item => {
  const nameElem = item.querySelector('.name span') || item.querySelector('.name');
  const name = nameElem?.textContent?.trim();
  if (!name) return;
  const elementImg = item.querySelector('.icon-code');
  const weaponImg = item.querySelector('.icon-weapon');
  const burstImg = item.querySelector('.icon-burst img');
  const jobImg = item.querySelector('.job');
  iconMap[name] = {
    elementIcon: elementImg?.src ?? '',
    weaponIcon: weaponImg?.src ?? '',
    burstIcon: burstImg?.src ?? '',
    classIcon: jobImg?.src ?? ''
  };
});

fs.writeFileSync(iconsPath, JSON.stringify(iconMap, null, 2) + '\n', 'utf-8');
console.log('Icon URLs extracted to character_icons.json');
