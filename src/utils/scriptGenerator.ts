// src/utils/scriptGenerator.ts
/**
 * Generates a browser‑side script that fetches all Nikke character data.
 * The script is meant to be copied into the console on https://www.blablalink.com
 * while the user is logged in.
 */
import type { ParsedFetch } from './fetchParser';

export function generateFetchScript(parsed: ParsedFetch, allCodes: number[]): string {
  // Single request with all character codes
  // Filter headers to only those allowed by the API and avoid CORS‑blocked ones
  // (allowedHeaders removed – not needed after switching to fetch parser)
  // Keep all headers as provided (including any required for authentication)
  const headersString = JSON.stringify(parsed.headers, null, 2);
  const intlOpenId = parsed.body?.intl_open_id ?? '';
  const nikkeAreaId = parsed.body?.nikke_area_id ?? 0;

  return `
// Nikke Character Data Fetcher – run in the console on blablalink.com
(async function() {
  console.log('Fetching data for ${allCodes.length} characters in a single request...');
  try {
    const response = await fetch('${parsed.url}', {
      method: 'POST',
      headers: ${headersString},
      body: JSON.stringify({
        intl_open_id: '${intlOpenId}',
        nikke_area_id: ${nikkeAreaId},
        name_codes: ${JSON.stringify(allCodes)}
      })
    });
    const data = await response.json();
    if (data.code === 0) {
      console.log('✓ Received', data.data?.character_details?.length || 0, 'characters');
      console.log(JSON.stringify([data], null, 2));
    } else {
      console.error('❌ API error', data.msg);
    }
  } catch (e) {
    console.error('❌ Fetch error', e);
  }
})();
`.trim();
}
