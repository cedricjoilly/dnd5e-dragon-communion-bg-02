# Dragon Communion Background for Foundry VTT (D&D 5e)

A custom background module for the D&D 5e system in Foundry VTT.

## Description

**The dragons once ruled the skies. Now the few that remain serve the Golden Order. You eschew their teachings, preferring instead to hunt them down. To commune with the dragons is to consume their hearts, eventually taking on their very physiology. But beware; those on the path to dragon communion can be overtaken by their powerful blood.**

## Features

- **Skill Proficiencies**: Survival, Nature
- **Tool Proficiencies**: Leatherworker's Tools
- **Languages**: One of your choice
- **Equipment**: Dragon Heart, Butchering Tools, Sturdy Dragonskin Sack, Leatherworker's Tools, Commoner's Clothes
- **Feature**: Journey of Fire - A unique sanity-based progression system

## Journey of Fire (Sanity System)

This background introduces a **Sanity Score** mechanic (starting at 10, max 10). As you slay dragons, your Sanity increases by 1. When your Sanity drops below certain thresholds, you gain powerful benefits:

| Sanity Score | Effect |
|--------------|--------|
| 8-9 | Advantage on Survival rolls to track dragons, and Intelligence checks to recall information about them |
| 6-7 | Advantage on saving throws against dragon attacks and abilities |
| 4-5 | Resistance to fire damage |
| 2-3 | Spell save DC increases by 1 when casting Dragon Communion incantations |
| 1 | Attacks against dragons deal an additional 3d6 damage on a hit |
| 0 | Transform into a Magma Wyrm, losing all mental faculties (becomes NPC under DM control) |

> **Note**: You gain all benefits for your current Sanity score AND those below it. For example, at Sanity 4, you have benefits from 9, 7, and 5.

## Installation

### Method 1: Module Browser (Recommended)
1. In Foundry VTT, go to **Add-on Modules** → **Install Module**
2. Search for "Dragon Communion Background"
3. Click **Install**

### Method 2: Manual Installation
1. Download the latest release zip from the repository
2. Extract to your Foundry VTT `Data/modules/dnd5e-dragon-communion-bg/` folder
3. Enable the module in **Manage Modules**

### Method 3: Manifest URL
1. In Foundry VTT, go to **Add-on Modules** → **Install Module**
2. Paste the manifest URL: `https://github.com/yourusername/dnd5e-dragon-communion-bg/releases/latest/download/module.json`
3. Click **Install**

## Usage

1. Enable the module in your world
2. Open the **Compendium Packs** sidebar (book icon)
3. Find **"Dragon Communion Backgrounds"** pack
4. Drag the **"Dragon Communion"** background to your character sheet
5. Or create a new character and select it during background selection

## Sanity Tracking

The background includes a custom sanity tracking system. To track your character's Sanity:

1. The background adds a **Sanity** attribute to your character (starting at 10)
2. When you slay a dragon, increase Sanity by 1
3. The DM determines when Sanity decreases (typically through corruption, failed saves, or narrative events)
4. Benefits apply automatically based on your current Sanity score

## Localization

- English (en)
- Portuguese - Brazil (pt-BR)

## Compatibility

- **System**: D&D 5e (foundryvtt/dnd5e) v3.0.0+
- **Foundry VTT**: v12+
- **Module API**: v12+

## Credits

Based on the "Dragon Communion" concept from Elden Ring / FromSoftware lore, adapted for D&D 5e.

## License

MIT License - Feel free to use, modify, and distribute.

## Changelog

### v1.0.0
- Initial release
- Dragon Communion background with full equipment, features, and sanity system
- English and Portuguese (Brazil) localizations
- Personality traits, ideals, bonds, and flaws tables