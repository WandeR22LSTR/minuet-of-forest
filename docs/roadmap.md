# Roadmap to 1.0

From 0.9 (five sections built, every page editable in Lens of Truth) to a finished site people can find their way around. The structure is done (`docs/site-plan.md`); what's left is mostly Luca's writing, a few decisions only Luca can make, and a visual pass.

**Where things stand (2026-11-13):** the homepage is written and the contact email is set. Everything else still shows `[placeholders]` to visitors, and research, Currently and every project's docs are drafts. This month the internship, REU and study abroad applications come first, so the roadmap starts with a sprint on the resume, research, CV and Japanese section.

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

## Applications sprint: resume, research, CV, Japanese
For the internship, REU and study abroad applications. These come before everything else, in this order: each assignment is one sitting. Reviewers arrive from the link on the resume, so the resume, the research page, the CV page and the Japanese section are what they see.

This list is only what shows on the site. Deadlines, requirements, statements, letters and which resume to send where are tracked outside this repo (it's public). Versions tailored to a single application are made there too; the site holds the two general ones.

### Assignment 1: The facts the site needs
- [x] Email to show: decided, and entered in Contact and both resumes (change it in **Data files** if that ever changes).
- [x] Research credit: the group name and credits as presented at the A&S summer fellowship poster.
- [ ] Read the Contact page and both resumes once on the live site, since the email is public.

### Assignment 2: Resume (by Dec 1)
Two versions, switched with the button at the top of each: **Physics** (`/resume/`) and **Japanese** (`/resume/jp/`), each with its own PDF. What each version says and leads with is decided on the applications side; this list is only getting it onto the site.
- [ ] **Resume (Physics)** (**Data files**): headline, education, research experience (credits as on the poster), skills, projects. Leave Temple of Time out until its summary is approved.
- [ ] **Resume (Japanese)** (**Data files**): its entries, as decided on the applications side.
- [ ] Open both with **▶ Preview**, and check both PDFs as printed after a build.

### Assignment 3: Research page (by early January; **Docs and research → Research**)
- [ ] Overview paragraph, starting from the poster's wording.
- [ ] The fellowship: programme, group and credits as on the poster, dates.
- [ ] The question, the data, and the method (maths in `$...$`, code blocks).
- [ ] Results: figures with captions (**Add image…**).
- [ ] Notebooks and code links; what's next; publications only if any exist, else delete the section.
- [ ] Untick **Draft**. The homepage Research button, the CV research card and the Docs research link switch on by themselves.

### Assignment 4: CV page and what frames it
- [ ] CV: research highlight (and delete its "until published" note once research is live).
- [ ] CV: selected projects. For each card: title, one line, **Link** to its docs. Remove a card you can't fill yet.
- [ ] CV: label for the PDF button.
- [ ] Site description, and the descriptions of the CV, resume, Japanese resume and Japanese pages (**Data files → Site text**): the lines link previews show.
- [ ] About: about this portfolio, and the statement of purpose *of the site* (not your application statement).

### Assignment 5: Capstone (**Docs and research → Capstone**)
- [ ] Overview and its three layers. Publish it.
- [ ] Capstone progress log: the first entry, in `src/content/capstone-log/` (Nabooru can make these editable in Lens).

### Assignment 6: Japanese section (by early January; `/japanese/`, in the top bar)
All of it shows here: coursework, language progress, projects and writing samples. Each is its own page under `/japanese/`, so the section can be rearranged as its requirements arrive.
- [ ] The landing page: introduction, and the heading over the list of pages (**Pages → japanese**). The list fills itself with every published page.
- [ ] **Japanese (Markdown) → Coursework**, **Language progress**, **Projects**, **Writing samples**: they start as drafts. Write each, untick **Draft**, and it appears on the landing page. Rename, delete or add pages (**+ New page here**) as needed.
- [ ] One line about the section on the homepage, and its description (**Data files → Site text**).
- [ ] The **Resume (Japanese)** button on the landing page leads to the Japanese resume.

**Pacing:** both resumes polished by **Dec 1**, the first day a reviewer may open the site; the research page and the Japanese section by **early January**; the CV page and the rest alongside.

**Done when:** `/resume/`, `/resume/jp/`, `/research/`, `/cv/` and `/japanese/` show no placeholders or `TODO`, both PDFs read well printed, and the links are on your applications.

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
