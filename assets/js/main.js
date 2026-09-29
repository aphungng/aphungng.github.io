/* Progressive enhancements — the site works without JavaScript. */
(function () {
  "use strict";

  /* ---- Language: English by default, French and Spanish on demand ----
     Texts are in the page in every language (CSS shows the one on <html lang>);
     attributes carry data-<attr>-fr / -es variants that are swapped in here. */
  var root = document.documentElement;
  var LANGS = ["en", "fr", "es"];
  var I18N_ATTRS = ["alt", "aria-label"];
  var baseTitle = document.title;
  var lang = function () { return LANGS.indexOf(root.lang) > -1 ? root.lang : "en"; };

  var setLang = function (l) {
    root.lang = l;
    try { localStorage.setItem("lang", l); } catch (e) { /* private mode: choice lasts for this page only */ }
    I18N_ATTRS.forEach(function (attr) {
      document.querySelectorAll("[data-" + attr + "-fr]").forEach(function (el) {
        var en = "data-" + attr + "-en";
        if (!el.hasAttribute(en)) el.setAttribute(en, el.getAttribute(attr) || "");
        el.setAttribute(attr, el.getAttribute("data-" + attr + "-" + l) || el.getAttribute(en));
      });
    });
    if (root.dataset.titleEn) {
      document.title = baseTitle.replace(root.dataset.titleEn, root.getAttribute("data-title-" + l) || root.dataset.titleEn);
    }
    document.querySelectorAll("[data-set-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.setLang === l));
    });
  };

  setLang(lang());
  document.querySelectorAll("[data-set-lang]").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.dataset.setLang); });
  });

  /* ---- Mobile navigation ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    });
  }

  /* ---- "Projects" dropdown: opens on hover with a mouse, on click/tap/Enter otherwise;
     closes on outside click or Escape ---- */
  var dropdown = document.querySelector(".nav-projects details");
  if (dropdown) {
    var item = dropdown.parentElement;
    var summary = dropdown.querySelector("summary");
    var list = dropdown.querySelector(".nav-sub");
    var hoverable = window.matchMedia("(hover: hover) and (min-width: 761px)");
    var closeTimer;

    item.addEventListener("mouseenter", function () {
      if (!hoverable.matches) return;
      clearTimeout(closeTimer);
      dropdown.open = true;
    });
    item.addEventListener("mouseleave", function () {
      if (!hoverable.matches) return;
      closeTimer = setTimeout(function () { dropdown.open = false; }, 200);
    });
    // A mouse click while hovering would toggle the menu shut; keep it open instead.
    // Keyboard activation (detail === 0) still toggles.
    summary.addEventListener("click", function (e) {
      if (hoverable.matches && e.detail > 0) {
        e.preventDefault();
        dropdown.open = true;
      }
    });
    // Bring the current project into view in the scrollable list.
    dropdown.addEventListener("toggle", function () {
      var current = list.querySelector('[aria-current="page"]');
      if (dropdown.open && current) {
        list.scrollTop = current.offsetTop - (list.clientHeight - current.offsetHeight) / 2;
      }
    });

    document.addEventListener("click", function (e) {
      if (dropdown.open && !dropdown.contains(e.target)) dropdown.open = false;
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && dropdown.open) {
        dropdown.open = false;
        dropdown.querySelector("summary").focus();
      }
    });
  }

  /* ---- YouTube: load the player only when asked ---- */
  document.querySelectorAll("[data-youtube]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + btn.dataset.youtube + "?autoplay=1&rel=0";
      iframe.title = btn.getAttribute("aria-label") || "YouTube";
      iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
      iframe.allowFullscreen = true;
      btn.replaceWith(iframe);
      iframe.focus();
    });
  });

  /* ---- Lightbox for [data-lightbox] links, grouped per section ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll("a[data-lightbox]"));
  if (links.length) {
    var box, img, counter, group = [], index = 0, lastFocus = null;

    var LABELS = {
      en: { viewer: "Image viewer", close: "Close", prev: "Previous image", next: "Next image" },
      fr: { viewer: "Visionneuse d'images", close: "Fermer", prev: "Image précédente", next: "Image suivante" },
      es: { viewer: "Visor de imágenes", close: "Cerrar", prev: "Imagen anterior", next: "Imagen siguiente" }
    };

    var build = function () {
      box = document.createElement("div");
      box.className = "lightbox";
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-modal", "true");
      box.innerHTML =
        '<img alt="">' +
        '<button class="lightbox-close" type="button">&times;</button>' +
        '<button class="lightbox-prev" type="button">&#8249;</button>' +
        '<button class="lightbox-next" type="button">&#8250;</button>' +
        '<p class="lightbox-count" aria-live="polite"></p>';
      img = box.querySelector("img");
      counter = box.querySelector(".lightbox-count");
      box.querySelector(".lightbox-close").addEventListener("click", close);
      box.querySelector(".lightbox-prev").addEventListener("click", function () { show(index - 1); });
      box.querySelector(".lightbox-next").addEventListener("click", function () { show(index + 1); });
      box.addEventListener("click", function (e) { if (e.target === box) close(); });
      document.body.appendChild(box);
    };

    var show = function (i) {
      index = (i + group.length) % group.length;
      var link = group[index];
      var thumb = link.querySelector("img");
      img.src = link.href;
      img.alt = thumb ? thumb.alt : "";
      counter.textContent = group.length > 1 ? (index + 1) + " / " + group.length : "";
      box.querySelector(".lightbox-prev").hidden = group.length < 2;
      box.querySelector(".lightbox-next").hidden = group.length < 2;
    };

    var onKey = function (e) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(index - 1);
      else if (e.key === "ArrowRight") show(index + 1);
      else if (e.key === "Tab") {
        var buttons = Array.prototype.filter.call(box.querySelectorAll("button"), function (b) { return !b.hidden; });
        var first = buttons[0], last = buttons[buttons.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    var open = function (link) {
      if (!box) build();
      var t = LABELS[lang()];
      box.setAttribute("aria-label", t.viewer);
      box.querySelector(".lightbox-close").setAttribute("aria-label", t.close);
      box.querySelector(".lightbox-prev").setAttribute("aria-label", t.prev);
      box.querySelector(".lightbox-next").setAttribute("aria-label", t.next);
      var section = link.closest("section, .prose, ul") || document.body;
      group = links.filter(function (l) { return section.contains(l); });
      lastFocus = link;
      show(group.indexOf(link));
      box.hidden = false;
      document.body.style.overflow = "hidden";
      requestAnimationFrame(function () { box.classList.add("is-open"); });
      document.addEventListener("keydown", onKey);
      box.querySelector(".lightbox-close").focus();
    };

    function close() {
      box.classList.remove("is-open");
      box.hidden = true;
      img.removeAttribute("src");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      if (lastFocus) lastFocus.focus();
    }

    links.forEach(function (link) {
      link.addEventListener("click", function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return; // let users open in a new tab
        e.preventDefault();
        open(link);
      });
    });
  }

  /* ---- Reveal on scroll ---- */
  var revealed = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    revealed.forEach(function (el) { io.observe(el); });
  } else {
    revealed.forEach(function (el) { el.classList.add("is-visible"); });
  }
})();
