import re
import json
import os

def generate_metadata():
    html_path = 'characterList.html'
    json_path = 'characterListResponse'
    output_path = 'src/data/character_metadata.json'

    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # 1. Parse HTML
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Split by character block
    # <div data-v-fd227194="" class="cursor-pointer relative nikkes-player-item ...">
    parts = html_content.split('class="cursor-pointer relative nikkes-player-item')
    blocks = parts[1:] # Skip header
    
    print(f"Found {len(blocks)} character blocks in HTML.")

    names = []
    images = []

    for i, block in enumerate(blocks):
        # Find name
        name_match = re.search(r'class="[^"]*name[^"]*"[^>]*><span[^>]*>([^<]+)</span>', block)
        name = name_match.group(1) if name_match else "UNKNOWN"
        names.append(name)
        
        # Find image
        # Try strict first, then loose
        img_match = re.search(r'<img[^>]*src="([^"]+)"[^>]*class="nikkes-player-item-img"', block)
        if not img_match:
             img_match = re.search(r'<img[^>]*class="nikkes-player-item-img"[^>]*src="([^"]+)"', block)
        if not img_match:
            img_match = re.search(r'<img[^>]*src="([^"]+)"', block)
            
        img_url = img_match.group(1) if img_match else ""
        images.append(img_url)

    # 2. Parse JSON
    with open(json_path, 'r', encoding='utf-8') as f:
        json_data = json.load(f)
    
    characters = json_data['data']['characters']
    print(f"Found {len(characters)} characters in JSON.")

    if len(blocks) != len(characters):
        print(f"Error: Count mismatch! HTML: {len(blocks)}, JSON: {len(characters)}")
        return

    # 3. Sort JSON by combat descending
    characters_sorted = sorted(characters, key=lambda x: x['combat'], reverse=True)

    # 4. Create Mapping
    metadata = {}
    
    for i in range(len(characters_sorted)):
        char_json = characters_sorted[i]
        char_name = names[i]
        char_img = images[i]
        
        name_code = str(char_json['name_code'])
        
        metadata[name_code] = {
            "name": char_name,
            "imageUrl": char_img,
            "combat": char_json['combat']
        }

    # 5. Write to file
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"Successfully generated metadata for {len(metadata)} characters at {output_path}")

    # Print first 5 for verification
    first_5_keys = list(metadata.keys())[:5]
    print("First 5 entries:")
    for k in first_5_keys:
        print(f"{k}: {metadata[k]['name']}")

if __name__ == "__main__":
    generate_metadata()
