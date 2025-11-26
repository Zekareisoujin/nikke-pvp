import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the metadata file
const metadataPath = path.join(__dirname, '../src/data/character_metadata_2.json');
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

// Create mapping from name_code to character name
const nameCodeToName = {};
for (const char of metadata) {
    if (char.name_code && char.name_localkey && char.name_localkey.name) {
        nameCodeToName[String(char.name_code)] = char.name_localkey.name;
    }
}

console.log(`Found ${Object.keys(nameCodeToName).length} characters in metadata`);

// Read the HTML file
const htmlPath = path.join(__dirname, '../temp-data/portrait.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// Parse HTML to extract character name -> portrait URL mapping
const nameToPortrait = {};

// Find all images with nikkes-player-item-img class
const imgRegex = /<img[^>]*class="[^"]*nikkes-player-item-img[^"]*"[^>]*>/g;
let imgMatch;
const imgPositions = [];

while ((imgMatch = imgRegex.exec(html)) !== null) {
    imgPositions.push({
        index: imgMatch.index,
        tag: imgMatch[0]
    });
}

// For each image, find the corresponding name
for (const imgPos of imgPositions) {
    // Extract URL from src or data-src attribute (prefer data-src if available)
    const dataSrcMatch = imgPos.tag.match(/data-src=["']([^"']+)["']/);
    const srcMatch = imgPos.tag.match(/src=["']([^"']+)["']/);
    
    let portraitUrl = null;
    if (dataSrcMatch && !dataSrcMatch[1].startsWith('data:image')) {
        portraitUrl = dataSrcMatch[1];
    } else if (srcMatch && !srcMatch[1].startsWith('data:image')) {
        portraitUrl = srcMatch[1];
    }
    
    if (!portraitUrl) continue;
    
    // Find the name span that appears after this image (within the next 3000 chars)
    const searchStart = imgPos.index;
    const searchEnd = Math.min(searchStart + 3000, html.length);
    const searchText = html.substring(searchStart, searchEnd);
    
    // Look for name pattern: <p...class="...name..."...><span...>Name</span>
    // Handle both regular and marquee cases
    const nameMatch = searchText.match(/<p[^>]*class="[^"]*name[^"]*"[^>]*>[\s\S]*?<span[^>]*class="[^"]*marquee-inner[^"]*"[^>]*>([^<]+)<\/span>/) ||
                     searchText.match(/<p[^>]*class="[^"]*name[^"]*"[^>]*>[\s\S]*?<span[^>]*>([^<]+)<\/span>/);
    
    if (!nameMatch) continue;
    
    // Normalize whitespace: replace newlines and multiple spaces with single space, then trim
    let charName = nameMatch[1].replace(/\s+/g, ' ').trim();
    
    // Store the exact name as it appears in HTML (no splitting)
    // Names with colons must match exactly
    if (!nameToPortrait[charName]) {
        nameToPortrait[charName] = portraitUrl;
    }
}

// Also find images with nikkes-all-item-img class (different section)
const allItemImgRegex = /<img[^>]*class="[^"]*nikkes-all-item-img[^"]*"[^>]*>/g;
let allItemImgMatch;
const allItemImgPositions = [];

while ((allItemImgMatch = allItemImgRegex.exec(html)) !== null) {
    allItemImgPositions.push({
        index: allItemImgMatch.index,
        tag: allItemImgMatch[0]
    });
}

// For each all-item image, find the corresponding name
for (const imgPos of allItemImgPositions) {
    // Extract URL from src or data-src attribute (prefer data-src if available)
    const dataSrcMatch = imgPos.tag.match(/data-src=["']([^"']+)["']/);
    const srcMatch = imgPos.tag.match(/src=["']([^"']+)["']/);
    
    let portraitUrl = null;
    if (dataSrcMatch && !dataSrcMatch[1].startsWith('data:image')) {
        portraitUrl = dataSrcMatch[1];
    } else if (srcMatch && !srcMatch[1].startsWith('data:image')) {
        portraitUrl = srcMatch[1];
    }
    
    if (!portraitUrl) continue;
    
    // Find the name div that appears after this image (within the next 3000 chars)
    const searchStart = imgPos.index;
    const searchEnd = Math.min(searchStart + 3000, html.length);
    const searchText = html.substring(searchStart, searchEnd);
    
    // Look for name pattern: <div...class="mt-[1px] text-stroke1...">Name</div>
    // Handle multiline names (e.g., "Mary: Bay\n                Goddess")
    const nameMatch = searchText.match(/<div[^>]*class="[^"]*mt-\[1px\][^"]*text-stroke1[^"]*"[^>]*>([\s\S]*?)<\/div>/);
    
    if (!nameMatch) continue;
    
    // Normalize whitespace: replace newlines and multiple spaces with single space, then trim
    let charName = nameMatch[1].replace(/\s+/g, ' ').trim();
    
    // Store the exact name as it appears in HTML (no splitting)
    // Names with colons must match exactly
    if (!nameToPortrait[charName]) {
        nameToPortrait[charName] = portraitUrl;
    }
}

console.log(`Found ${Object.keys(nameToPortrait).length} characters in HTML`);

// Create the final mapping: name_code -> portrait URL
const portraits = {};
let matched = 0;
let unmatched = [];

for (const [nameCode, name] of Object.entries(nameCodeToName)) {
    // Only exact matches - names with colons must match exactly
    if (nameToPortrait[name]) {
        portraits[nameCode] = nameToPortrait[name];
        matched++;
    } else {
        unmatched.push({ nameCode, name });
    }
}

console.log(`Matched ${matched} characters`);
if (unmatched.length > 0) {
    console.log(`\nUnmatched characters (${unmatched.length}):`);
    unmatched.forEach(({ nameCode, name }) => {
        console.log(`  ${nameCode} -> ${name}`);
    });
}

// Read existing portraits file
const portraitsPath = path.join(__dirname, '../src/data/character_portraits.json');
const existingPortraits = JSON.parse(fs.readFileSync(portraitsPath, 'utf8'));

// Merge: keep existing entries, update/add new ones
const mergedPortraits = { ...existingPortraits, ...portraits };

// Sort by name_code (as string, but numerically)
const sortedPortraits = {};
Object.keys(mergedPortraits)
    .map(k => parseInt(k))
    .sort((a, b) => a - b)
    .forEach(k => {
        sortedPortraits[String(k)] = mergedPortraits[String(k)];
    });

// Write the updated file
fs.writeFileSync(portraitsPath, JSON.stringify(sortedPortraits, null, 4) + '\n', 'utf8');

console.log(`\nUpdated ${portraitsPath}`);
console.log(`Total portraits: ${Object.keys(sortedPortraits).length}`);

