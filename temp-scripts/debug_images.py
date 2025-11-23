import re
import json
import os

def analyze_blocks():
    html_path = 'characterList.html'
    
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Split by character block
    # <div data-v-fd227194="" class="cursor-pointer relative nikkes-player-item ...">
    # We can split by 'class="cursor-pointer relative nikkes-player-item'
    
    parts = html_content.split('class="cursor-pointer relative nikkes-player-item')
    
    # The first part is header/garbage
    blocks = parts[1:]
    
    print(f"Total blocks found: {len(blocks)}")
    
    missing_images = []
    
    for i, block in enumerate(blocks):
        # Find name
        name_match = re.search(r'class="[^"]*name[^"]*"[^>]*><span[^>]*>([^<]+)</span>', block)
        name = name_match.group(1) if name_match else "UNKNOWN"
        
        # Find image
        # <img data-v-fd227194="" src="..." class="nikkes-player-item-img" alt="">
        img_match = re.search(r'<img[^>]*src="([^"]+)"[^>]*class="nikkes-player-item-img"', block)
        
        if not img_match:
            # Try less strict pattern
            img_match = re.search(r'<img[^>]*src="([^"]+)"', block)
            
        if not img_match:
            missing_images.append((i, name))
            print(f"Block {i} ({name}): No image found!")
            # Print snippet
            print(f"Snippet: {block[:200]}...")
        else:
            # print(f"Block {i} ({name}): Image found")
            pass

    print(f"Total missing images: {len(missing_images)}")

if __name__ == "__main__":
    analyze_blocks()
