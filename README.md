# DP-700 Unique Expert Simulator

A from-scratch, static DP-700 practice website focused on difficult code-reading and implementation questions.

## What is included

- 190 distinct expert questions
- No automatic repetition across attempts
- Persistent used-question history in `localStorage`
- Explicit **Reset question history** control
- Dark and light themes
- 20, 40, or 60 question exams
- Mixed, coding-only, PySpark, KQL, T-SQL, and Fabric pools
- Single choice
- Select-two questions
- Code dropdown completion
- Sequence ordering
- Item matching
- Timer, navigation, mark-for-review, scoring, topic results, and full answer review
- Direct browser operation with no backend required

## No-repeat behavior

Questions are marked as used when an exam starts, not only when it is submitted. This prevents a user from refreshing or abandoning an attempt to receive the same questions again.

The simulator never resets used-question history automatically. When all relevant questions are exhausted, select **Reset question history** on the landing page.

## Run it

Extract the ZIP and open `index.html` in Chrome or Edge.

A local web server is optional:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Project structure

```text
dp700-unique-simulator/
├── index.html
├── README.md
├── css/
│   └── styles.css
└── js/
    ├── questions.js
    └── app.js
```

## Question-bank validation

At startup the application checks for:

- Duplicate question IDs
- Duplicate normalized prompt and code signatures

The build fails visibly if a duplicate exists.

## Content note

The practice content is original and unofficial. It is not copied from the Microsoft certification exam. Topics were designed around the published DP-700 skill areas and current Microsoft Fabric concepts.
