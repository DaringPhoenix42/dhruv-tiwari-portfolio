# Dhruv Tiwari Portfolio

Dark, responsive developer portfolio for Dhruv Tiwari with a Three.js Earth background, dynamic GitHub data, resume-driven content, and mobile-first sections for experience, education, activities, projects, skills, and contact.

## Live Data

- Portfolio content is stored in `data.js`.
- GitHub profile and repository details are fetched from the public GitHub API.
- LinkedIn is linked directly because LinkedIn profile data is not reliably available to static websites without official API access.

## Project Structure

```text
.
├── index.html
├── styles.css
├── app.js
├── data.js
├── .gitignore
├── .nojekyll
└── README.md
```

## Run Locally

Use any local static server. For example:

```bash
python -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173
```

## Update Content

Edit `data.js` to update:

- Name and contact details
- LinkedIn and GitHub links
- Education
- Experience
- Extracurricular activities
- Projects
- Skills and certifications

## Tech Used

- HTML
- CSS
- JavaScript
- Three.js
- GitHub public API

