# Portfolio — Alice Phung-Ngoc

Personal website, built with [Jekyll](https://jekyllrb.com/) and hosted for free on
**GitHub Pages**. GitHub rebuilds and publishes the site automatically on every push:
no server, no third-party website builder.

## Structure

```
_config.yml            Site settings (title, URL, collections, plugins)
_data/                 Content that isn't a page — edit these to update the site
  profile.yml            Name, headline, bio, contact links, "Last updated" date
  navigation.yml         Main menu (the "Projects" menu is generated automatically)
  education.yml          "Education" timeline on the home page
  parcours.yml           /parcours/ page content
  esprit.yml             /esprit/ page content
  tools.yml              Technology names (logos in assets/img/tools/)
  organizations.yml      Schools/companies (logos in assets/img/logos/)
  i18n.yml               Interface text (buttons, headings…) in EN / FR / ES
_projects/             One Markdown file per project → /projets/<file-name>/
_layouts/              Page templates (default, project)
_includes/             Reusable pieces (header, footer, gallery, youtube, figures…)
index.html             Home page
esprit.html            /esprit/
parcours.html          /parcours/
assets/
  css/main.css           All styles (colours are variables at the top)
  js/main.js             Language switch, menus, lightbox, YouTube loader, scroll animations
  img/projects/<slug>/   cover.jpg (home card), hero.jpg (banner), gallery/ (+ thumbs/)
tools/optimize_image.py  Resize images / add gallery photos
```

## Common edits

**Add a project**
1. Create `_projects/my-project.md`:
   ```markdown
   ---
   title: My project
   title_fr: Mon projet            # optional translations of any field: _fr / _es
   title_es: Mi proyecto
   order: 8                      # position in menus and on the home page
   category: Project · Virtual reality
   category_fr: Projet · Réalité virtuelle
   category_es: Proyecto · Realidad virtual
   summary: One-paragraph introduction shown under the banner.
   summary_fr: …
   summary_es: …
   tools: [unity, csharp]        # keys from _data/tools.yml
   organizations: [insa]         # keys from _data/organizations.yml
   links:                        # optional
     - label: Demo
       label_fr: Démo
       url: https://example.com
   ---

   <div class="i18n" lang="en" markdown="1">

   ## Development
   Free Markdown text…

   </div>
   (same block with lang="fr", then lang="es" — see "Languages" above)

   {% include youtube.html id="VIDEO_ID" title="Caption" title_fr="Légende" title_es="Leyenda" %}
   {% include figures.html images="shot-1.jpg,shot-2.jpg" %}
   ```
2. Put `cover.jpg` and `hero.jpg` in `assets/img/projects/my-project/`.
3. Add gallery photos (numbered automatically, thumbnails generated):
   ```
   python tools/optimize_image.py photo.png --gallery my-project
   ```
   Any image in `gallery/` shows up in the "Project gallery" section, sorted by file name.


## Previewing locally (optional)

Requires Ruby ([RubyInstaller](https://rubyinstaller.org/) on Windows, with the MSYS2 devkit).

```
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000.
