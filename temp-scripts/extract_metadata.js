import fs from 'fs';
import { JSDOM } from 'jsdom';

// Read the HTML file
const html = fs.readFileSync('./characterList.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

// Get all character items
const characterItems = document.querySelectorAll('.nikkes-player-item');

console.log(`Found ${characterItems.length} characters`);

const metadata = {};

characterItems.forEach((item, index) => {
  try {
    // Get character name
    const nameElement = item.querySelector('.name span');
    if (!nameElement) return;
    
    const name = nameElement.textContent.trim();
    
    // Get element/code (iron, wind, water, fire, electronic)
    const codeImg = item.querySelector('.icon-code');
    const codeMatch = codeImg?.src?.match(/icon-code-(\w+)\.png/);
    const element = codeMatch ? codeMatch[1] : null;
    
    // Get weapon type
    const weaponImg = item.querySelector('.icon-weapon');
    const weaponMatch = weaponImg?.src?.match(/icon-weapon-(\w+)\.png/);
    let weaponType = weaponMatch ? weaponMatch[1] : null;
    
    // Clean up weapon type names
    if (weaponType) {
      weaponType = weaponType.replace(/_/g, ' ');
      // Capitalize each word
      weaponType = weaponType.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
    
    // Get burst type (1, 2, 3, or p for passive)
    const burstElement = item.querySelector('.icon-burst');
    const burstMatch = burstElement?.className?.match(/icon-burst\s+(\w+)/);
    let burstType = burstMatch ? burstMatch[1] : null;
    
    // Also check the img src
    if (!burstType) {
      const burstImg = item.querySelector('.icon-burst img');
      const burstSrcMatch = burstImg?.src?.match(/icon-burst-(\w+)\.png/);
      burstType = burstSrcMatch ? burstSrcMatch[1] : null;
    }
    
    // Get class (attacker, defender, supporter)
    const jobImg = item.querySelector('.job');
    const jobMatch = jobImg?.src?.match(/nikke-job-(\w+)--/);
    let characterClass = jobMatch ? jobMatch[1] : null;
    
    // Clean up class names
    if (characterClass) {
      if (characterClass === 'defencer') characterClass = 'defender';
      characterClass = characterClass.charAt(0).toUpperCase() + characterClass.slice(1);
    }
    
    // Get rarity (count the stars)
    const stars = item.querySelectorAll('.nikke-star img');
    let rarity = 'SSR'; // Default
    
    // Check if it's gold stars (SSR) or regular stars (SR/R)
    const hasGoldStar = Array.from(stars).some(star => 
      star.src.includes('icon-nikke-star-gold')
    );
    
    if (stars.length === 0) {
      rarity = 'R';
    } else if (stars.length === 2) {
      rarity = 'SR';
    } else if (stars.length === 3) {
      rarity = hasGoldStar ? 'SSR' : 'SSR';
    }
    
    // Store metadata
    metadata[name] = {
      name,
      element,
      weaponType,
      burstType,
      class: characterClass,
      rarity
    };
    
  } catch (error) {
    console.error(`Error processing character ${index}:`, error.message);
  }
});

// Read existing metadata
let existingMetadata = {};
try {
  const existingData = fs.readFileSync('./src/data/character_metadata.json', 'utf8');
  existingMetadata = JSON.parse(existingData);
} catch (error) {
  console.log('No existing metadata found, creating new file');
}

// Merge with existing metadata (preserve any manual additions)
const mergedMetadata = { ...existingMetadata };

Object.keys(metadata).forEach(name => {
  if (mergedMetadata[name]) {
    // Update existing entry with new data
    mergedMetadata[name] = {
      ...mergedMetadata[name],
      ...metadata[name]
    };
  } else {
    // Add new entry
    mergedMetadata[name] = metadata[name];
  }
});

// Write to file
fs.writeFileSync(
  './src/data/character_metadata.json',
  JSON.stringify(mergedMetadata, null, 2)
);

console.log(`\nExtracted metadata for ${Object.keys(metadata).length} characters`);
console.log(`Total characters in database: ${Object.keys(mergedMetadata).length}`);

// Show a few examples
console.log('\nSample metadata:');
Object.keys(metadata).slice(0, 5).forEach(name => {
  console.log(`\n${name}:`);
  console.log(JSON.stringify(metadata[name], null, 2));
});
