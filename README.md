# Portfolio — Alice Phung-Ngoc

Personal website, built with [Jekyll](https://jekyllrb.com/) and hosted for free on
**GitHub Pages**. GitHub rebuilds and publishes the site automatically on every push:
no server, no third-party website builder.

## Structure

```
_config.yml            Site settings (title, URL, collections, plugins)
_data/                 Content that isn't a page — edit these to update the site
  profile.yml            Name, headline, bio, contact links, "Mise à jour" date
  navigation.yml         Main menu (the "Projets" menu is generated automatically)
  education.yml          "Formation" timeline on the home page
  parcours.yml           /parcours/ page content
  esprit.yml             /esprit/ page content
  tools.yml              Technology names (logos in assets/img/tools/)
  organizations.yml      Schools/companies (logos in assets/img/logos/)
_projects/             One Markdown file per project → /projets/<file-name>/
_layouts/              Page templates (default, project)
_includes/             Reusable pieces (header, footer, gallery, youtube, figures…)
index.html             Home page
esprit.html            /esprit/
parcours.html          /parcours/
assets/
  css/main.css           All styles (colours are variables at the top)
  js/main.js             Mobile menu, lightbox, YouTube loader, scroll animations
  img/projects/<slug>/   cover.jpg (home card), hero.jpg (banner), gallery/ (+ thumbs/)
tools/optimize_image.py  Resize images / add gallery photos
```

## Common edits

**Update the bio, contact or "Mise à jour" date** → `_data/profile.yml`.

**Add a project**
1. Create `_projects/my-project.md`:
   ```markdown
   ---
   title: My project
   order: 8                      # position in menus and on the home page
   category: Projet · Réalité virtuelle
   summary: One-paragraph introduction shown under the banner.
   tools: [unity, csharp]        # keys from _data/tools.yml
   organizations: [insa]         # keys from _data/organizations.yml
   links:                        # optional
     - label: Demo
       url: https://example.com
   ---

   ## Développement
   Free Markdown text…

   {% include youtube.html id="VIDEO_ID" title="Optional caption" %}
   {% include figures.html images="shot-1.jpg,shot-2.jpg" %}
   ```
2. Put `cover.jpg` and `hero.jpg` in `assets/img/projects/my-project/`.
3. Add gallery photos (numbered automatically, thumbnails generated):
   ```
   python tools/optimize_image.py photo.png --gallery my-project
   ```
   Any image in `gallery/` shows up in the "Galerie du projet" section, sorted by file name.

**Add a tool or organisation logo** → add a line in `_data/tools.yml` /
`_data/organizations.yml` and the matching PNG in `assets/img/tools/` / `assets/img/logos/`.

## Publishing on GitHub Pages

1. Create a GitHub repository named **`aphungng.github.io`** (the site will then be at
   `https://aphungng.github.io/`). Any other name works too; then set
   `baseurl: "/<repo-name>"` in `_config.yml`.
2. Push this folder to the `main` branch:
   ```
   git init -b main
   git add .
   git commit -m "Initial portfolio"
   git remote add origin https://github.com/aphungng/aphungng.github.io.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   branch `main`, folder `/ (root)`. The site is live a minute later.

A custom domain (e.g. `alicephung.fr`) can be added later in the same settings page.

## Previewing locally (optional)

Requires Ruby ([RubyInstaller](https://rubyinstaller.org/) on Windows, with the MSYS2 devkit).

```
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000.
