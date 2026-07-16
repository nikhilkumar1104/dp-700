# DP-700 Certification Practice Simulator - HTML/CSS Version

This is a static website version of the **DP-700 Certification Practice Simulator** built with:

- HTML
- CSS
- Vanilla JavaScript for exam interaction
- Browser localStorage for immediate offline-safe autosave
- Optional Supabase authentication and cross-device cloud progress

The exam remains usable without a backend. Supabase is optional and enables account login, cross-device resume, completed-attempt history, best score, and last score.

## How to run

Open this file in your browser:

```txt
index.html
```

Recommended: use VS Code Live Server or any simple static server for the best browser behavior.

```bash
python -m http.server 8080
```

Then open:

```txt
http://localhost:8080
```

## Included features

- Landing page
- Pre-exam instructions
- Candidate agreement checkbox
- Candidate information panel
- 120-minute mock exam timer
- Timed quiz mode
- Topic practice mode
- Adaptive practice mode
- Weak area training mode
- Final readiness assessment mode
- Auto-save every 10 seconds
- Previous and next navigation
- Random question shuffle at the start of every exam
- Question number navigator
- Locked exam flow that blocks in-app navigation until Submit Exam is used
- Browser back and refresh warning while an exam is active
- Mark for review
- Answer elimination
- Check My Answer feedback with correct answer, user answer, and explanation for each option
- Browser focus detection log
- Auto-submit on timer completion
- Exam summary page
- Topic-wise scoring
- Weak area recommendations
- Review mode
- Bookmarked questions
- Candidate dashboard
- Admin-style question bank preview
- High contrast mode
- Responsive design
- Email/password account creation and sign-in
- Cross-device synchronization of answers, flags, timer state, and completed results
- Local-storage fallback when signed out or temporarily offline
- Row Level Security so users can access only their own progress

## Enable cloud accounts and progress

1. Create a project at [Supabase](https://supabase.com/).
2. Open **SQL Editor** and run the complete [`supabase-schema.sql`](supabase-schema.sql) file.
3. Open **Project Settings > API** in Supabase.
4. Copy the Project URL and anon/publishable key into [`js/supabase-config.js`](js/supabase-config.js).
5. In **Authentication > URL Configuration**, set the Site URL to the GitHub Pages URL and add the same URL to Redirect URLs.
6. Commit the configuration update and wait for GitHub Pages to redeploy.

Only the public anon/publishable key belongs in the browser configuration. Never commit a Supabase `service_role` key.

## Question bank

The project generates 1000 original DP-700-style practice questions in the browser using templates and scenario variation. These questions are original practice content and are not copied from any official exam.

## Disclaimer

This is an unofficial practice simulator and is not affiliated with Microsoft.

Do not use Microsoft logos, trademarks, branding, copied exam questions, or confidential certification content.

## File structure

```txt
dp700-html-css-simulator/
├── index.html
├── README.md
├── supabase-schema.sql
├── css/
│   └── styles.css
└── js/
    ├── app.js
    ├── supabase-config.js
    └── questions.js
```

## Notes

The app always writes progress to `localStorage` first. When Supabase is configured and the user signs in, the same progress is also synchronized to PostgreSQL and can be restored on another device. The exam lock can block in-app navigation and show browser warnings, but no normal website can fully prevent a user from closing the browser tab, force-killing the browser, or typing a different URL.

## Latest updates

This version includes:

- Shuffled answer options for single choice, multiple choice, case study, scenario, architecture, pipeline design, and troubleshooting questions.
- Shuffled starting order for sequence ordering and drag-and-drop style questions.
- Shuffled left/right items for matching questions.
- Green/red answer feedback after using **Check My Answer**.
- Improved high contrast mode so question cards, ordering cards, option explanations, dashboard panels, and buttons remain readable.
- Active exam state versioning so older saved exam states are cleared when this updated build is opened.

## v4 fix

- Matching-question dropdown choices are now force-shuffled and cannot remain in their original order.
- Each matching row gets its own shuffled dropdown option order.
- Choice and ordering questions use a non-identity shuffle, so the first render will not accidentally appear already aligned.
- The saved exam state version was updated, so older cached attempts are cleared automatically when this build opens.

## v5 fix
- Fixed match-item scoring so correct mappings are accepted regardless of object/key order.
- Check My Answer now shows green when all match pairs are correct.
- Uses a new localStorage key to avoid loading older cached exam attempts from previous builds.

## v6 fix
- Rebuilt the question generator with deeper topic, scenario, tool, and template variation so the exam does not feel like the same questions repeated with small word changes.
- Broke the old pattern where some question types were always tied to the same topic.
- Added no-repeat question selection across recent attempts using browser localStorage.
- Added stratified picking so mock exams are more balanced across question types and topics.
- Regenerating the bank also resets no-repeat memory.
