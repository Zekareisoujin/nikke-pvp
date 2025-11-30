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
User-Agent: Mozilla/5.0 ... (Required)
x-channel-type: 2
x-language: en
x-common-params: {...}
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

## Findings (Updated)

### 1. Ownership Requirement
- The API **only** returns data for characters the user **owns**.
- Requesting a character code that the user does **not** own results in error:
  `1302125: get info list err`

### 2. Batching Behavior
- **Mixed Batches Fail**: If a request contains a mix of valid (owned) and invalid (unowned) codes, the **entire request fails** with `get info list err`.
- **Empty/Null List Fails**: Sending `name_codes: []`, `null`, or omitting the field results in `param invalid`.
- **Conclusion**: We cannot blindly request "all" characters. We must know the list of owned character IDs beforehand.

### 3. Payload Limits
- Valid batches of 10, 15, 30 work (if all are owned).
- Max batch size is likely higher, but constrained by the "all owned" requirement.

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
        ...
      }
    ]
  }
}
```

## CORS Policy

**Status**: ❌ **No CORS support**
- Requires Proxy (Serverless Worker implemented).

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
