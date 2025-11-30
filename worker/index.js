export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const body = await request.json();
      const { intl_open_id, nikke_area_id, headers } = body;

      if (!intl_open_id || !nikke_area_id || !headers) {
        return new Response("Missing required fields", { status: 400 });
      }

      // Base URL for the game API
      const baseUrl = "https://api.blablalink.com/api/game/proxy/Game";

      // Prepare headers for the upstream request
      const upstreamHeaders = new Headers();
      for (const [key, value] of Object.entries(headers)) {
          // Skip headers that are automatically handled or problematic
          if (['host', 'content-length', 'connection', 'accept-encoding', 'origin', 'referer'].includes(key.toLowerCase())) continue;
          upstreamHeaders.set(key, value);
      }
      
      upstreamHeaders.set("Content-Type", "application/json");
      upstreamHeaders.set("Origin", "https://www.blablalink.com");
      upstreamHeaders.set("Referer", "https://www.blablalink.com/");

      // Step 1: Get Owned Characters
      const listUrl = `${baseUrl}/GetUserCharacters`;
      const listPayload = {
        intl_open_id,
        nikke_area_id
      };

      const listResponse = await fetch(listUrl, {
        method: "POST",
        headers: upstreamHeaders,
        body: JSON.stringify(listPayload),
      });

      if (!listResponse.ok) {
         return new Response(`Failed to fetch character list: ${listResponse.status}`, { status: 502 });
      }

      const listData = await listResponse.json();
      if (listData.code !== 0) {
          return new Response(JSON.stringify(listData), { 
              status: 200, // Return 200 so frontend can see the API error message
              headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
      }

      const ownedCharacters = listData.data?.characters || [];
      const nameCodes = ownedCharacters.map(c => c.name_code);

      if (nameCodes.length === 0) {
          return new Response(JSON.stringify({ code: 0, msg: "No characters found", data: { character_details: [] } }), {
              headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
      }

      // Step 2: Get Character Details
      const detailsUrl = `${baseUrl}/GetUserCharacterDetails`;
      const detailsPayload = {
        intl_open_id,
        nikke_area_id,
        name_codes: nameCodes
      };

      const detailsResponse = await fetch(detailsUrl, {
        method: "POST",
        headers: upstreamHeaders,
        body: JSON.stringify(detailsPayload),
      });

      const detailsData = await detailsResponse.text();
      
      // Return the response to the client with CORS headers
      return new Response(detailsData, {
        status: detailsResponse.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  },
};
