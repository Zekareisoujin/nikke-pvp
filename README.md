# Nikke PvP Team Builder

A web application for building and analyzing teams for the game **Nikke: Goddess of Victory**. This tool allows users to select characters, form a team of 5, and (in the future) calculate team effectiveness and stats.

## Features

### Current
- **Team Deck**: A 5-slot area to assemble your team.
- **Character Pool**: A list of available Nikke characters to choose from.
- **Selection Logic**: 
    - Click a character in the pool to add them to the first available slot.
    - Click a selected character (in the pool or deck) to remove them.
    - Prevents adding more than 5 characters.
- **Mock Data**: Currently uses a set of mock characters for demonstration.

### Planned
- **Stats Calculation**: Calculate overall team power, burst chain compatibility, and elemental synergies.
- **Filtering & Sorting**: Filter characters by Burst Type, Element, Class, and Manufacturer.
- **Save & Share**: Save team compositions and share them via URL or image.
- **Drag & Drop**: Improved UI for organizing the team.

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

- `src/components`: UI Components (`CharacterCard`, `TeamDeck`, `CharacterPool`).
- `src/types.ts`: TypeScript definitions for Nikke data models.
- `src/data.ts`: Mock data source.
- `src/App.tsx`: Main application logic and layout.
