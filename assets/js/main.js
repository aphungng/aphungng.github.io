/* Progressive enhancements — the site works without JavaScript. */
(function () {
  "use strict";

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

  /* ---- "Projets" dropdown: close on outside click or Escape ---- */
  var dropdown = document.querySelector(".nav-projects details");
  if (dropdown) {
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
      iframe.title = btn.getAttribute("aria-label") || "Vidéo YouTube";
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

    var build = function () {
      box = document.createElement("div");
      box.className = "lightbox";
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-modal", "true");
      box.setAttribute("aria-label", "Visionneuse d'images");
      box.innerHTML =
        '<img alt="">' +
        '<button class="lightbox-close" type="button" aria-label="Fermer">&times;</button>' +
        '<button class="lightbox-prev" type="button" aria-label="Image précédente">&#8249;</button>' +
        '<button class="lightbox-next" type="button" aria-label="Image suivante">&#8250;</button>' +
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
