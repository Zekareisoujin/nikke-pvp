// src/utils/fetchParser.ts
/**
 * Simple parser for a fetch command string.
 * Expected format (as shown by the user):
 * fetch("https://api.blablalink.com/...", {
 *   "headers": { ... },
 *   "referrer": "...",
 *   "body": "{...}",
 *   "method": "POST",
 *   "mode": "cors",
 *   "credentials": "include"
 * });
 *
 * The parser extracts the URL, headers object, and parses the JSON body string.
 * It returns an object compatible with the existing `ParsedCurl` type used by
 * `scriptGenerator`.
 */
export interface ParsedFetch {
  url: string;
  headers: Record<string, string>;
  body: any; // already parsed JSON object
}

export function parseFetchCommand(fetchCommand: string): ParsedFetch {
  // Remove line breaks for easier regex handling
  const singleLine = fetchCommand.replace(/\n/g, ' ');

  // Capture the URL and the options object
  const match = singleLine.match(/fetch\s*\(\s*['"]([^'\"]+)['"]\s*,\s*({[\s\S]*})\s*\)/);
  if (!match) {
    throw new Error('Unable to parse fetch command – unexpected format');
  }

  const url = match[1];
  let optionsStr = match[2];

  // The options object is valid JSON except for possible trailing commas.
  // Remove trailing commas before closing braces/brackets.
  optionsStr = optionsStr.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

  let options: any;
  try {
    options = JSON.parse(optionsStr);
  } catch (e) {
    // As a fallback, try eval in a sandboxed way (dangerous but limited here)
    // eslint-disable-next-line no-new-func
    options = new Function('return ' + optionsStr)();
  }

  const headers: Record<string, string> = options.headers || {};
  let body = options.body;
  // If body is a JSON string, parse it
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (_) {
      // keep as string if not JSON
    }
  }

  return { url, headers, body };
}
