# ScaleWise Competitor Intelligence Repository

A Netlify-ready static web app for reverse-engineering the marketing strategy of KPO, offshore accounting, CPA outsourcing, BPO, bookkeeping, tax, payroll, and finance operations competitors.

## What it does

- Tracks competitors and research status
- Stores evidence from websites, archives, LinkedIn, YouTube, PR, jobs, SEO pages, and other sources
- Separates confirmed evidence from strategic inference
- Scores competitors by marketing maturity
- Converts insights into ScaleWise execution actions
- Generates a markdown competitor strategy report
- Exports/imports data as JSON
- Exports evidence as CSV

## How to deploy on Netlify

### Option 1: Drag and drop

1. Zip this folder or upload the folder contents.
2. Go to Netlify.
3. Use **Add new site > Deploy manually**.
4. Drag the folder into Netlify.

### Option 2: GitHub + Netlify

1. Create a new GitHub repository.
2. Upload all files in this folder.
3. Connect the GitHub repository to Netlify.
4. Build command: leave blank.
5. Publish directory: `/`.

## Files

- `index.html` — main application layout
- `styles.css` — ScaleWise navy/gold styling
- `app.js` — local database, forms, dashboards, report generator
- `netlify.toml` — Netlify static deployment config

## Important note about storage

This MVP uses browser localStorage. That means data is saved in the browser you use. Use **Export JSON** regularly to back up your repository.

For a multi-user/team database later, connect this to Supabase, Firebase, Airtable, or a custom backend.

## Suggested next upgrades

- Add login/authentication
- Add Supabase cloud database
- Add AI report generation API
- Add source citation manager
- Add competitor change alerts
- Add automated SEO/LinkedIn/YouTube source ingestion
- Add PDF export
