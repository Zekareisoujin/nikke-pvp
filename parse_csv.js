import fs from 'fs';
import path from 'path';

const files = {
  burstGen: 'Nikke PVP Burst Generation Calculator - Burst Gen.csv',
  cubeBurstGen: 'Copy of Nikke PVP Burst Generation Calculator - Cube Burst Gen.csv',
  feedChart1: 'Copy of Nikke PVP Burst Generation Calculator - Feed Chart 1 target.csv',
  feedChart2: 'Copy of Nikke PVP Burst Generation Calculator - Feed Chart 2 Target.csv',
};

const parseCsv = (filename) => {
  const csvPath = path.resolve('/home/zeka/Workspace/nikke-pvp', filename);
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

console.log(`export const burstGenData: Record<string, { [key: string]: number }> = ${JSON.stringify(burstGenData, null, 2)};`);
console.log(`export const cubeBurstGenData: Record<string, { [key: string]: number }> = ${JSON.stringify(cubeBurstGenData, null, 2)};`);
console.log(`export const feedChart1Data: Record<string, { [key: string]: number }> = ${JSON.stringify(feedChart1Data, null, 2)};`);
console.log(`export const feedChart2Data: Record<string, { [key: string]: number }> = ${JSON.stringify(feedChart2Data, null, 2)};`);

