# Cartograph — Cartographer Sheet

A static HTML character sheet for **Cartograph: Atlas Edition** by The Ravensridge Press.

A solo/multiplayer mapmaking TTRPG about journaling, exploration, worldbuilding, and resource management.

## Features

- **Multi-character** — switch between characters via URL param (`?c=eman` or `?c=autumn`)
- **Persistent** — all data saves to localStorage automatically
- **Tags** — add/remove tags as you earn them during play
- **Journal** — a growing text area to record your journey
- **Export/Import** — save and share character data as JSON files
- **Bookmarkable** — each character has a unique URL you can bookmark

## Usage

Open `index.html` in any browser. Or self-host on any static server.

### URL slugs

| Slug | Example | Effect |
|---|---|---|
| `#/name` | `index.html#/autumn` | Loads that character's sheet |

Bookmark `https://captainhowlingmadmurdockbot.github.io/cartograph-sheet/#/autumn` and it opens Autumn's sheet directly.

### Toolbar

- **Character dropdown** — switch between any characters you've created
- **+ New** — create a new character (enter a name, gets slugified)
- **Rename** — rename the current character (copies all data to the new slug, removes the old)
- **Delete** — permanently remove the current character and all their data
- **Export** — download character data as JSON
- **Import** — upload a previously exported JSON file
- **Reset** — clear all data for the current character

## Self-hosting

Just serve the directory with any static file server:

```bash
python3 -m http.server 8080
```

Or deploy to GitHub Pages, Netlify, Vercel, etc.

## License

MIT
