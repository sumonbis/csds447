# CSDS 447 · Responsible AI Engineering — Inline Edition

No file loading. All content lives **inside the HTML files** as embedded Markdown/CSV blocks.

## Edit Content
- **Home page text:** in `index.html`, find:
  ```html
  <script type="text/markdown" id="home-inline"> ... </script>
  ```
  Edit that Markdown.

- **Schedule:** in `index.html`, find:
  ```html
  <script type="text/csv" id="schedule-inline"> ... </script>
  ```
  Edit the CSV (header must be `Date,Topic,Reading,Assignment`).

- **Logistics page:** in `logistics.html`, find:
  ```html
  <script type="text/markdown" id="logistics-inline"> ... </script>
  ```

## Preview Locally
```bash
python3 -m http.server 8000
open http://localhost:8000/index.html
```

## Deploy
Push to GitHub Pages as usual; there are no external content files to fetch.
