# Roadmap to 1.0

From 0.9 (four sections built, every page editable in Lens of Truth) to a finished site people can find their way around. The structure is done (`docs/site-plan.md`); what's left is mostly Luca's writing, a few decisions only Luca can make, and a visual pass.

**Where things stand (2026-11-12):** the homepage is written. Nothing else is yet: every other published page still shows `[placeholders]` to visitors, and research, Currently and every project's docs are drafts. This month the internship, REU and study abroad applications come first, so the roadmap starts with a sprint on the resume, research and CV.

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

## Applications sprint: resume, research, CV
For the internship, REU and study abroad applications. These come before everything else, in this order: each assignment is one sitting, and the earlier ones unblock the later ones. Reviewers arrive from the link on the resume, so the resume, the research page and the CV page are what they see.

### Assignment 1: Start what has a waiting time (10 minutes)
- [ ] Write down each application's deadline and what it asks for (resume, statement, references), wherever you keep such notes.
- [ ] Ask your PI to approve the wording of the research overview, and whether the group and supervisor can be named.
- [ ] Decide the email address to show (**Data files → Contact**, and the resume's email).

### Assignment 2: Resume (**Data files → Resume**)
- [ ] Headline.
- [ ] Education: degree, institution, location, dates, bullets.
- [ ] Research experience: position, group, dates, what you did (wording checked with your PI).
- [ ] Skills, including languages.
- [ ] Projects: only ones you can describe publicly now. Leave Temple of Time out until its summary is approved.
- [ ] Open `/resume/` with **▶ Preview**, and check `resume.pdf` as printed after a build.

### Assignment 3: Research page (**Docs and research → Research**)
- [ ] Overview paragraph (PI-approved wording).
- [ ] The fellowship: programme, group, supervisor (only if they agree), dates.
- [ ] The question, the data, and the method (maths in `$...$`, code blocks).
- [ ] Results: figures with captions (**Add image…**).
- [ ] Notebooks and code links; what's next; publications only if any exist, else delete the section.
- [ ] Untick **Draft**. The homepage Research button, the CV research card and the Docs research link switch on by themselves.

### Assignment 4: CV page and what frames it
- [ ] CV: research highlight (and delete its "until published" note once research is live).
- [ ] CV: selected projects. For each card: title, one line, **Link** to its docs. Remove a card you can't fill yet.
- [ ] CV: label for the PDF button.
- [ ] Site description and the CV and resume page descriptions (**Data files → Site text**): the lines link previews show.
- [ ] About: about this portfolio, and the statement of purpose.

### Assignment 5: Capstone (**Docs and research → Capstone**)
- [ ] Overview and its three layers. Publish it.
- [ ] Capstone progress log: the first entry, in `src/content/capstone-log/` (Nabooru can make these editable in Lens).

### Assignment 6: Japanese and study abroad
- [ ] Decide where Japanese shows: a Languages line on the resume (Assignment 2), a section on the CV page, a Garden page for the learning journey, or a mix. Tell Nabooru, who builds the section; you write it.

**Done when:** `/resume/`, `/research/` and `/cv/` show no placeholders or `TODO`, the PDF reads well printed, and the link is on your applications.

## Milestone 1: The rest of what's on show
Every other published page reads as finished. Drafts can stay drafts.

### Site-wide
- [ ] 404 page: title, message, link back home (**Data files → Site text**).
- [ ] Page descriptions for About and Garden (**Data files → Site text**).

### Home
- [x] Title and intro.
- [x] Previews of Docs, CV, Garden and About.

### Garden
- [ ] Introduction to the garden.
- [ ] Link text to the Currently page (shows once Currently is published).

### Docs landing page
- [ ] Description, introduction, guide to the research section, link text to research, guide to the projects.

**Done when:** `npm run todos` lists no placeholders for these pages, and **▶ Preview** shows none anywhere you can reach from the top bar.

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

## Milestone 3: Garden
- [ ] **Currently:** Reading, Watching, Playing, Listening, and its description. Publish it; the Garden page shows its first section.
- [ ] **Project screenshots and demos:** decide where they live (Garden pages, or each project's docs) and add the first ones. Images go in through **Add image…** in Lens.
- [ ] **Obsidian notes** (the published slice of the vault): needs building first.
  - Lens: read-only access to the vault (a Lens version bump).
  - Minuet: a notes section in the Garden.
  - Decide which notes are public before anything is built.

**Done when:** Currently is published and the Garden page has something beyond its introduction.

## Milestone 4: Visual pass
Theming, animation and possibly sound. Philosophically minimal, to keep a semi-professional feel:
- every effect earns its place;
- respects `prefers-reduced-motion`;
- any sound is off by default and opt-in;
- nothing gets in the way of reading.

- [ ] Decide the direction (Ocarina of Time theming, how much).
- [ ] A handoff for it, then build. Checks stay green: contrast, 360px, keyboard.

## 1.0 release checklist
- [ ] The applications sprint and Milestones 1–3 done (or the parts left over deliberately parked, written down here).
- [ ] `npm run todos`: empty, or every remaining item deliberately parked.
- [ ] `npm run build`, `npm run check`, `npm run a11y` and `npm run scan` all pass.
- [ ] Read every page once on a phone and once on a computer, following only the top bar and the links.
- [ ] Resume PDF checked as printed.
- [ ] `NOCTURNE_URL` set if Nocturne is live (the hidden footer medallion), or left empty.
- [ ] Version 1.0.0 in `package.json`, with a `CHANGELOG.md` entry.
