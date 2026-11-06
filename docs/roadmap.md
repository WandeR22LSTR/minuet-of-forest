# Roadmap to 1.0

From 0.9 (four sections built, every page editable in Lens of Truth) to a finished site people can find their way around. The structure is done (`docs/site-plan.md`); what's left is mostly Luca's writing, a few decisions only Luca can make, and a visual pass.

**Where things stand (2026-11-03):** the homepage is written. Every other published page still shows `[placeholders]` to visitors: About, CV, Garden, the Docs landing page, and the page descriptions and 404 text in `src/data/copy.yaml`. Research, Currently and every project's docs are drafts, so visitors don't see them yet. `npm run todos` lists 29 placeholders and 69 `TODO(Luca)` items.

## How to work through it
1. **Pick the next unticked item** below, in milestone order.
2. **Write it in Lens** (**☰ Menu** shows every page and data file with what's left to write):
   - Layout pages (Home, About, CV, Garden) and Markdown pages (docs, research, Currently) are in the page picker.
   - Fill in the `[placeholders]` and replace the `TODO(Luca)` lines.
   - Check it with **▶ Preview** at 360 and 1280.
3. **Publish a draft** by unticking **Draft** in its editor once it's finished. Until then it stays off the live site.
4. **Commit & Push** (Cmd/Ctrl+K) after each sitting. Pushing `main` publishes the site.
5. **See what's left** with `npm run todos`. A section is done when its checklist is ticked and `todos` lists nothing for it.
6. **Structure changes** (a new page, a new block type, a layout that Lens can't make) are for Nabooru: start a chat on this repo with what you want.

Text that isn't on a page lives in YAML data files: site text (`copy.yaml`: page descriptions, 404), contact, projects and the resume. They're in Lens too: **☰ Menu → Data files** opens each as a form beside the page that shows it. This roadmap is in **☰ Menu** as well: tick items there and Lens updates this file.

## Milestone 1: Nothing unfinished on show
Every published page reads as finished, so the site can be shared. Drafts can stay drafts.

### Site-wide
- [ ] Site description (`copy.yaml` → `site.description`): the line search engines and link previews show.
- [ ] Contact email to show (`contact.yaml`), or decide to show GitHub only.
- [ ] 404 page: title, message, link back home (`copy.yaml` → `not_found`).
- [ ] Page descriptions for About, CV, Garden and the resume (`copy.yaml`).

### Home
- [x] Title and intro.
- [x] Previews of Docs, CV, Garden and About.
- [ ] Check the Research button: it appears by itself once research is published (Milestone 3).

### About
- [ ] About this portfolio.
- [ ] Statement of purpose of the site.
- [ ] Contact section shows what you want (follows `contact.yaml`).

### CV
- [ ] Research highlight, and the note shown until research is published.
- [ ] Choose the selected projects. For each card: title, one line, and its **Link** to the project's docs. Add or remove cards in Lens.
- [ ] Label for the PDF button.
- [ ] Resume (`resume.yaml`): headline, education, research position (wording checked with your PI), projects, skills. The resume page and `resume.pdf` are built from it.
- [ ] Note shown while the resume is being written (`copy.yaml` → `resume.empty`), only if anything stays unfinished.

### Garden
- [ ] Introduction to the garden.
- [ ] Link text to the Currently page (shows once Currently is published).

### Docs landing page
- [ ] Description, introduction, guide to the research section, link text to research, guide to the projects.

**Done when:** `npm run todos` lists no placeholders for these pages, and **▶ Preview** shows none anywhere you can reach from the top bar. Then share the link.

## Milestone 2: Project docs
One project done properly first, then the rest at whatever pace suits each.

### Decisions first
- [ ] **Temple of Time:** approve the public summary (`docs/temple-of-time-summary.md`, "awaiting Luca's approval"). Nothing about it is published until then.
- [ ] Which projects to publish now; the others stay drafts.

### For each project you publish (`/docs/<project>/`)
- [ ] **Overview:** what it is, status, version, timeline, links.
- [ ] **Changelog:** at least the current version.
- [ ] Any documentation pages it needs. **+ New page here** in Lens creates them as drafts.
- [ ] Its entry in `projects.yaml`: summary, link label. It shows on the Docs landing page.
- [ ] Untick **Draft** on each finished page.

| Project | Pages now | Note |
|---|---|---|
| Temple of Time | overview, changelog, 10 chapters | Wait for summary approval |
| Minuet of Forest | overview, changelog | Also "about this site" |
| Prelude of Light | overview, changelog | |
| Saria's Song | overview, changelog | |
| Ice Cavern | overview, changelog | |

**Done when:** the published projects have no `TODO(Luca)` and the Docs landing page lists them with working links.

## Milestone 3: Research
- [ ] **Research page** (`/research/`): overview (wording approved by your PI), the fellowship (programme, group, supervisor only if they agree to be named, dates), the question, data, method (maths, code), results (figures with captions), notebooks and code, what's next, publications (only what exists; else delete the section).
- [ ] **Capstone** (`/research/capstone/`): overview and its three layers.
- [ ] Publish both. The homepage Research button, the CV research card and the Docs research link all switch on by themselves.
- [ ] Capstone progress log: the first entry, in `src/content/capstone-log/` (Nabooru can make these editable in Lens).

**Done when:** research is published and every link to it works (`npm run check` passes).

## Milestone 4: Garden
- [ ] **Currently:** Reading, Watching, Playing, Listening, and its description. Publish it; the Garden page shows its first section.
- [ ] **Project screenshots and demos:** decide where they live (Garden pages, or each project's docs) and add the first ones. Images go in through **Add image…** in Lens.
- [ ] **Obsidian notes** (the published slice of the vault): needs building first.
  - Lens: read-only access to the vault (a Lens version bump).
  - Minuet: a notes section in the Garden.
  - Decide which notes are public before anything is built.

**Done when:** Currently is published and the Garden page has something beyond its introduction.

## Milestone 5: Visual pass
Theming, animation and possibly sound. Philosophically minimal, to keep a semi-professional feel:
- every effect earns its place;
- respects `prefers-reduced-motion`;
- any sound is off by default and opt-in;
- nothing gets in the way of reading.

- [ ] Decide the direction (Ocarina of Time theming, how much).
- [ ] A handoff for it, then build. Checks stay green: contrast, 360px, keyboard.

## 1.0 release checklist
- [ ] Milestones 1–4 done (or the parts left over deliberately parked, written down here).
- [ ] `npm run todos`: empty, or every remaining item deliberately parked.
- [ ] `npm run build`, `npm run check`, `npm run a11y` and `npm run scan` all pass.
- [ ] Read every page once on a phone and once on a computer, following only the top bar and the links.
- [ ] Resume PDF checked as printed.
- [ ] `NOCTURNE_URL` set if Nocturne is live (the hidden footer medallion), or left empty.
- [ ] Version 1.0.0 in `package.json`, with a `CHANGELOG.md` entry.
