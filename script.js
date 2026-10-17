if (typeof emailjs !== "undefined") {
  emailjs.init("zGg6PSsNVbHjx1E6U");
}

const form = document.getElementById("contact-form");
const message = document.getElementById("form-message");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (form.company.value.trim() !== "") {
      // Piège à bots : champ honeypot rempli, on ignore silencieusement.
      form.reset();
      return;
    }

    if (typeof emailjs === "undefined") {
      message.textContent = "Service d'envoi indisponible pour le moment, réessayez plus tard.";
      message.style.color = "#e57373";
      return;
    }

    const full = document.getElementById("message-full");
    if (full) {
      const val = (n) => (form.elements[n] ? form.elements[n].value.trim() : "");
      const checked = (n) =>
        Array.from(form.querySelectorAll(`input[name="${n}"]:checked`)).map((c) => c.value).join(", ");
      full.value = [
        `Type de projet : ${val("project_type")}`,
        `Budget : ${val("budget")}`,
        `Délai : ${val("deadline")}`,
        `Téléphone : ${val("phone") || "—"}`,
        `Activité / structure : ${val("organization") || "—"}`,
        `Site existant : ${val("existing_site") || "—"}`,
        `Fonctionnalités : ${checked("features") || "—"}`,
        `Contenus disponibles : ${checked("assets") || "—"}`,
        `\nDescription :\n${val("description")}`,
        `\nPages envisagées :\n${val("pages") || "—"}`,
        `\nInspirations :\n${val("references") || "—"}`,
        `\nRemarques :\n${val("notes") || "—"}`,
      ].join("\n");
    }

    emailjs.sendForm("service_fube5n4", "template_portfolio", this)
      .then(() => {
        message.textContent = "Message envoyé avec succès !";
        message.style.color = "#4fd1c5";
        form.reset();
        message.scrollIntoView({ behavior: "smooth", block: "center" });
      })
      .catch((error) => {
        const detail = error && error.text ? ` (${error.text})` : "";
        message.textContent = "Erreur lors de l'envoi, réessayez plus tard." + detail;
        message.style.color = "#e57373";
        console.error("Erreur EmailJS :", error);
      });
  });
}

const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.getElementById("primary-nav");

if (navToggle && primaryNav) {
  const closeMenu = () => {
    primaryNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Ouvrir le menu");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (e) => {
    if (!primaryNav.classList.contains("open")) return;
    if (!primaryNav.contains(e.target) && !navToggle.contains(e.target)) {
      closeMenu();
    }
  });
}

const navLinks = document.querySelectorAll(".navbar nav a[href^='#']");
const sections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (sections.length && "IntersectionObserver" in window) {
  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveLink(visible.target.id);
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
  );

  sections.forEach((section) => observer.observe(section));
}

const groupSelectors = [".cards", ".process-grid", ".faq-list"];
const revealTargets = [];

document.querySelectorAll(".section").forEach((section) => {
  Array.from(section.children).forEach((child) => {
    if (groupSelectors.some((sel) => child.matches(sel))) {
      Array.from(child.children).forEach((item) => revealTargets.push(item));
    } else {
      revealTargets.push(child);
    }
  });
});

revealTargets.forEach((el) => el.classList.add("reveal"));

if (revealTargets.length && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = Array.from(el.parentElement.children).filter((c) =>
          c.classList.contains("reveal")
        );
        const delay = siblings.indexOf(el) * 80;
        setTimeout(() => el.classList.add("visible"), delay);
        revealObserver.unobserve(el);
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));
}

/* Consentement aux cookies */
const CONSENT_KEY = "kp-cookie-consent";

const readConsent = () => {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch (e) {
    return null;
  }
};

const loadOptionalServices = () => {
  // TODO: charger ici le script de statistiques (ex. GoatCounter) une fois activé.
};

const updateConsentStatus = () => {
  const label = document.getElementById("cookie-status");
  if (!label) return;
  const value = readConsent();
  label.textContent =
    value === "accepted" ? "cookies optionnels acceptés" :
    value === "refused" ? "cookies optionnels refusés" : "non défini";
};

const setConsent = (value) => {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch (e) {
    /* stockage indisponible : le choix ne sera pas mémorisé */
  }
  const banner = document.getElementById("cookie-banner");
  if (banner) banner.remove();
  if (value === "accepted") loadOptionalServices();
  updateConsentStatus();
};

if (readConsent() === "accepted") loadOptionalServices();
updateConsentStatus();

document.querySelectorAll("[data-cookie-choice]").forEach((btn) => {
  btn.addEventListener("click", () => setConsent(btn.dataset.cookieChoice));
});

if (!readConsent() && !document.querySelector(".legal-page")) {
  const banner = document.createElement("div");
  banner.id = "cookie-banner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-label", "Autorisation des cookies");
  banner.innerHTML =
    '<p>Ce site peut utiliser des cookies optionnels de mesure d\'audience. Vous pouvez les accepter ou les refuser, ' +
    'et modifier votre choix à tout moment. <a href="cookies.html">En savoir plus</a></p>' +
    '<div class="cookie-actions">' +
    '<button type="button" class="btn btn-ghost" data-choice="refused">Refuser</button>' +
    '<button type="button" class="btn btn-primary" data-choice="accepted">Accepter</button>' +
    "</div>";
  banner.querySelectorAll("[data-choice]").forEach((btn) => {
    btn.addEventListener("click", () => setConsent(btn.dataset.choice));
  });
  document.body.appendChild(banner);
}
