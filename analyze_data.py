import re
import json
import os

def analyze():
    html_path = 'characterList.html'
    json_path = 'characterListResponse'

    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Regex to find character blocks and names
    # Based on snippet: <p data-v-fd227194="" class="name text-19 text-white absolute"><span data-v-fd227194="">Crown</span></p>
    # And image: <img data-v-fd227194="" src="..." class="nikkes-player-item-img" alt="">
    
    # Let's try to find all names
    name_pattern = re.compile(r'<p[^>]*class="[^"]*name[^"]*"[^>]*><span[^>]*>([^<]+)</span></p>')
    names = name_pattern.findall(html_content)

    print(f"Total names found in HTML: {len(names)}")
    print(f"First 10 names in HTML: {names[:10]}")
    
    # Check for duplicates
    unique_names = set(names)
    print(f"Unique names in HTML: {len(unique_names)}")

    # Load JSON
    with open(json_path, 'r', encoding='utf-8') as f:
        json_data = json.load(f)
    
    characters = json_data['data']['characters']
    print(f"Total characters in JSON: {len(characters)}")
    
    # Sort JSON by combat to see if it matches
    # Assuming descending order usually
    characters_sorted_desc = sorted(characters, key=lambda x: x['combat'], reverse=True)
    characters_sorted_asc = sorted(characters, key=lambda x: x['combat'], reverse=False)

    print(f"Top 5 JSON characters (Combat Desc): {[c['name_code'] for c in characters_sorted_desc[:5]]}")
    
    # We don't have names in JSON, only name_code. So we can't directly compare names yet.
    # But we can check if the count of unique names in HTML matches the count in JSON.

if __name__ == "__main__":
    analyze()
