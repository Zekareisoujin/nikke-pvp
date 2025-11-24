# Nikke PvP Team Builder

A web application for building and analyzing teams for the game **Nikke: Goddess of Victory**. This tool allows users to select characters, form a team of 5, and calculate detailed burst generation stats.

## Features

### Implemented
- **Real Character Data**: All 107 characters with real names and images from official game data
- **Complete Character Metadata**: 
    - Element, weapon type, burst type, class, and rarity extracted from official website
    - Character cards display metadata icons (element, weapon, burst, class)
    - Icon data separated into reusable `character_icons.json` file
- **Team Deck**: A 5-slot area to assemble your team
- **Character Pool**: Browse and select from all available Nikke characters
- **Team Gen Rating**: Visual indicator showing the team's overall burst speed (e.g., "3 RL BURST")
- **Burst Generation Calculator**:
    - Calculates burst generation for different tiers (2RL, 2.5RL, 3RL, etc.)
    - **Quantum Cube Bonuses**: Supports 'No Cube', 'Level 1', 'Level 3', and 'Level 7' cubes with specific bonus values
    - **Bullet Counts**: Displays the range of bullets required for each tier
- **Data Integration**:
    - Real character metadata extracted from official website (names, images, name_codes, element, weapon, burst, class, rarity)
    - Burst generation data parsed from CSVs
    - Cube bonuses and bullet count data
- **Search & Filtering**:
    - Search characters by name
    - Filter by Element, Weapon Type, Class, Burst Type, and Rarity
    - Optimized rendering with CSS-based filtering
- **Team Persistence**: Team selections automatically save to localStorage
- **UI Enhancements**:
    - Burst generation display in TeamDeck (tier-by-tier percentages with color coding)
    - Expandable/collapsible Burst Stats section
    - Compact square character cards in TeamDeck
    - Click to remove characters from team
- **GitHub Pages Deployment**: Automated deployment via GitHub Actions with auto-update detection

### Planned
- **Character Data Import**: Manual import feature for real player character stats from official API
- **Save & Share**: Share team compositions via URL or image
- **Drag & Drop**: Improved UI for organizing the team
- **Character Pool**: Support treasure units variants
- **Advanced Data**: Automatic integration with official API (pending CORS solution)
- **Multi-Team Support**: Configure multiple teams at once (3 for Special Arena, 5 for Champion's Arena)
- **Simulation**: Pit 2 teams head-to-head

### API Investigation
See [API_INVESTIGATION.md](./API_INVESTIGATION.md) for detailed findings on integrating with the official Nikke API.

## Tech Stack

- **Framework**: React + TypeScript + Vite
- **UI Library**: Chakra UI
- **Styling**: Emotion (via Chakra UI)

## Getting Started

1.  **Install dependencies**:
    ```bash
    yarn install
    ```

2.  **Run the development server**:
    ```bash
    yarn dev
    ```

3.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

- `src/components/`: UI Components (`CharacterCard`, `TeamDeck`, `CharacterPool`, `BurstStats`)
- `src/types.ts`: TypeScript definitions for Nikke data models
- `src/data/character_metadata.json`: Character metadata (element, weapon, burst, class, rarity)
- `src/data/character_icons.json`: Icon URLs for character metadata (element, weapon, burst, class)
- `src/data.ts`: Character data source with metadata and icon merging
- `src/burstGenData.ts`: Generated data file containing burst generation values
- `src/App.tsx`: Main application logic and layout
- `temp_scripts/`: Temporary scripts for data extraction and processing (not part of the web app)

## Data Sources

Character metadata is extracted from:
- `characterList.html`: HTML data from official website containing character names and images
- `characterListResponse`: API response containing `name_code` mappings and combat power stats

The metadata generation script (`generate_metadata.py`) matches characters by sorting both sources by combat power (descending order).
