# Nikke PvP Team Builder

A web application for building and analyzing teams for the game **Nikke: Goddess of Victory**. This tool allows users to select characters, form a team of 5, and calculate detailed burst generation stats.

## Features

### Implemented
- **Real Character Data**: All 107 characters with real names and images from official game data
- **Team Deck**: A 5-slot area to assemble your team
- **Character Pool**: Browse and select from all available Nikke characters
- **Team Gen Rating**: Visual indicator showing the team's overall burst speed (e.g., "3 RL BURST")
- **Burst Generation Calculator**:
    - Calculates burst generation for different tiers (2RL, 2.5RL, 3RL, etc.)
    - **Quantum Cube Bonuses**: Supports 'No Cube', 'Level 1', 'Level 3', and 'Level 7' cubes with specific bonus values
    - **Bullet Counts**: Displays the range of bullets required for each tier
- **Data Integration**:
    - Real character metadata extracted from official website (names, images, name_codes)
    - Burst generation data parsed from CSVs
    - Cube bonuses and bullet count data

### Planned
- **Complete Character Metadata**: Populate missing fields (burst type, class, element, manufacturer, weapon type, rarity)
- **Filtering & Sorting**: Filter characters by Burst Type, Element, Class, and Manufacturer
- **Save & Share**: Save team compositions and share them via URL or image
- **Drag & Drop**: Improved UI for organizing the team

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
- `src/data/character_metadata.json`: Real character metadata (107 characters)
- `src/data.ts`: Character data source with metadata import
- `src/burstGenData.ts`: Generated data file containing burst generation values
- `src/App.tsx`: Main application logic and layout
- `parse_csv.js`: Script to parse raw CSV data into `src/burstGenData.ts`
- `generate_metadata.py`: Script to extract character metadata from HTML and API responses

## Data Sources

Character metadata is extracted from:
- `characterList.html`: HTML data from official website containing character names and images
- `characterListResponse`: API response containing `name_code` mappings and combat power stats

The metadata generation script (`generate_metadata.py`) matches characters by sorting both sources by combat power (descending order).
