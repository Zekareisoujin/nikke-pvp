import fs from 'fs';
import path from 'path';

const files = {
  burstGen: 'burst_gen.csv',
  cubeBurstGen: 'cube_burst_gen.csv',
  feedChart1: 'feed_chart_1.csv',
  feedChart2: 'feed_chart_2.csv',
};

const parseCsv = (filename) => {
  const csvPath = path.resolve('/home/zeka/Workspace/nikke-pvp/csv-data', filename);
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.trim().split('\n');
  const data = {};

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Handle commas inside quotes if necessary (simple split for now)
    const parts = line.split(',');
    const name = parts[0].trim();
    
    data[name] = {
      '2RL': parseFloat(parts[1]),
      '5SG(2.5RL)': parseFloat(parts[2]),
      '3RL': parseFloat(parts[3]),
      '7SG(3.5RL)': parseFloat(parts[4]),
      '4RL': parseFloat(parts[5]),
    };
  }
  return data;
};

const burstGenData = parseCsv(files.burstGen);
const cubeBurstGenData = parseCsv(files.cubeBurstGen);
const feedChart1Data = parseCsv(files.feedChart1);
const feedChart2Data = parseCsv(files.feedChart2);

// Generate allNikkes list from burstGenData keys
const allNikkes = Object.keys(burstGenData).map((name, index) => ({
  id: String(index + 1),
  name: name,
  burstType: 'I', // MOCKED
  classType: 'Attacker', // MOCKED
  element: 'Fire', // MOCKED
  manufacturer: 'Elysion', // MOCKED
  weaponType: 'AR', // MOCKED
  imageUrl: 'https://static.wikia.nocookie.net/nikke-goddess-of-victory-international/images/9/9b/Rapi_icon.png', // MOCKED
  rarity: 'SSR', // MOCKED
}));

console.log(`export const burstGenData: Record<string, { [key: string]: number }> = ${JSON.stringify(burstGenData, null, 2)};`);
console.log(`export const cubeBurstGenData: Record<string, { [key: string]: number }> = ${JSON.stringify(cubeBurstGenData, null, 2)};`);
console.log(`export const feedChart1Data: Record<string, { [key: string]: number }> = ${JSON.stringify(feedChart1Data, null, 2)};`);
console.log(`export const feedChart2Data: Record<string, { [key: string]: number }> = ${JSON.stringify(feedChart2Data, null, 2)};`);
console.log(`export const allNikkes = ${JSON.stringify(allNikkes, null, 2)};`);

