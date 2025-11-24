# Nikke API Investigation Notes

## API Endpoint
```
POST https://api.blablalink.com/api/game/proxy/Game/GetUserCharacterDetails
```

## Authentication Requirements

### Required Headers
```
Content-Type: application/json
Origin: https://www.blablalink.com
Referer: https://www.blablalink.com/
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
x-channel-type: 2
x-language: en
x-common-params: {"game_id":"16","area_id":"global","source":"pc_web","intl_game_id":"29080","language":"en","env":"prod"}
```

### Required Cookies
```
game_openid=<user_openid>
game_token=<session_token>
game_uid=<user_id>
```

**Note**: Session tokens are short-lived and tied to active browser sessions on blablalink.com

## Request Payload

```json
{
  "intl_open_id": "6947834250529773558",
  "nikke_area_id": 85,
  "name_codes": [5065, 5155, 5101, ...]
}
```

### Payload Limits
- ✅ **10 characters**: Works
- ✅ **15 characters**: Works
- ✅ **30 characters**: Works
- ❓ **50+ characters**: Untested (session expired during test)

**Conclusion**: API supports **at least 30 characters per request** (3x the initial assumption)

## Response Structure

```json
{
  "code": 0,
  "code_type": 0,
  "msg": "ok",
  "data": {
    "character_details": [
      {
        "name_code": 5004,
        "lv": 1,
        "combat": 61371,
        "arena_combat": 58125,
        "grade": 3,
        "skill1_lv": 10,
        "skill2_lv": 4,
        "ulti_skill_lv": 10,
        "harmony_cube_tid": 1000303,
        "harmony_cube_lv": 8,
        "arena_harmony_cube_tid": 0,
        "arena_harmony_cube_lv": 0,
        "favorite_item_tid": 100602,
        "favorite_item_lv": 5,
        "attractive_lv": 10,
        "costume_tid": 0,
        "core": 0,
        "head_equip_tid": 3111001,
        "head_equip_tier": 10,
        "head_equip_lv": 0,
        "head_equip_option1_id": 7001006,
        "head_equip_option2_id": 7000704,
        "head_equip_option3_id": 0,
        "torso_equip_tid": 3211001,
        "torso_equip_tier": 10,
        "arm_equip_tid": 3311001,
        "arm_equip_tier": 10,
        "leg_equip_tid": 3411001,
        "leg_equip_tier": 10
      }
    ],
    "state_effects": [
      {
        "id": "7000510",
        "icon": "icn_skill_public_01",
        "functions": [700051001],
        "function_details": [
          {
            "id": 700051001,
            "level": 10,
            "function_type": "IncElementDmg",
            "function_value": 2215,
            "function_value_type": "Percent",
            "function_battlepower": 828
          }
        ]
      }
    ]
  }
}
```

## CORS Policy

**Status**: ❌ **No CORS support**

The API does **NOT** return `Access-Control-Allow-Origin` headers, meaning:
- Direct browser requests from GitHub Pages will be **blocked**
- OPTIONS preflight requests return **405 Method Not Allowed**

## Integration Options

### Option 1: CORS Proxy (Quick Test)
Use third-party proxy service (e.g., `corsproxy.io`)
- ❌ Cookies won't work
- ❌ Relies on third-party service

### Option 2: Backend Proxy (Recommended for Production)
Deploy serverless function (Vercel/Netlify/Cloudflare Workers)
- ✅ Full control
- ✅ Can handle authentication
- ❌ Requires backend infrastructure

### Option 3: Browser Extension (Best UX)
Chrome/Firefox extension running in blablalink.com context
- ✅ Has access to cookies
- ✅ Can make authenticated requests
- ✅ Best user experience
- ❌ Requires extension development

### Option 4: Manual Import (MVP - Selected)
Users copy/paste API responses
- ✅ **Easiest to implement**
- ✅ No backend needed
- ✅ Works immediately
- ❌ Manual process for users

**Decision**: Implement **Option 4** for MVP

## Implementation Plan

### Phase 1: Manual Import UI
1. Add "Import Character Data" button
2. Accept JSON paste from API response
3. Parse and validate character data
4. Merge multiple pastes (users need ~4 requests for all characters)
5. Save to localStorage

### Phase 2: Helper Script (Optional)
Provide browser console script that:
- Batches all character codes into groups of 30
- Makes authenticated requests
- Combines results
- Outputs single JSON for easy paste

### Phase 3: Future Enhancement
Consider browser extension or backend proxy for seamless integration

## Notes
- Session tokens expire quickly (minutes)
- Users must be logged into blablalink.com
- API returns detailed equipment, skills, and cube data
- Data can be used for accurate burst generation calculations
