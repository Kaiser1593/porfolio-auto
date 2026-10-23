(function () {
  var C = window.EAC || {};
  var MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

  // Menu mobile
  var burger = document.querySelector(".burger"), nav = document.querySelector("nav");
  if (burger) burger.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });

  // Coordonnées issues de config.js
  document.querySelectorAll("[data-email]").forEach(function (a) {
    a.href = "mailto:" + C.email; a.textContent = C.email;
  });
  document.querySelectorAll("[data-cotisation]").forEach(function (e) { e.textContent = C.cotisation; });
  var an = document.getElementById("annee"); if (an) an.textContent = new Date().getFullYear();

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Évènements
  var up = document.getElementById("events-upcoming"), past = document.getElementById("events-past");
  if (up && window.EVENEMENTS) {
    var today = new Date().toISOString().slice(0, 10);
    var list = window.EVENEMENTS.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    function card(e, isPast) {
      var d = new Date(e.date + "T12:00:00");
      return '<article class="event' + (isPast ? " past" : "") + '"><div class="date"><b>' + d.getDate() +
        "</b><span>" + MOIS[d.getMonth()] + " " + d.getFullYear() + "</span></div><div><h3>" + esc(e.titre) +
        '</h3><p class="lieu">📍 ' + esc(e.lieu || "") + "</p><p>" + esc(e.description) + "</p></div></article>";
    }
    var coming = list.filter(function (e) { return e.date >= today; });
    var done = list.filter(function (e) { return e.date < today; }).reverse();
    up.innerHTML = coming.length ? coming.map(function (e) { return card(e, false); }).join("")
      : '<p class="notice">Aucun évènement programmé pour le moment. Revenez bientôt !</p>';
    if (past) {
      past.innerHTML = done.map(function (e) { return card(e, true); }).join("");
      if (!done.length && past.previousElementSibling) past.previousElementSibling.hidden = true;
    }
  }

  // Adhésion : redirection HelloAsso si configuré, sinon e-mail pré-rempli
  var fa = document.getElementById("form-adhesion");
  if (fa) {
    if (C.lienAdhesion) {
      document.getElementById("adhesion-en-ligne").innerHTML =
        '<a class="btn" href="' + esc(C.lienAdhesion) + '" target="_blank" rel="noopener">Adhérer et payer en ligne</a>';
    }
    fa.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var f = new FormData(fa), g = function (k) { return f.get(k) || ""; };
      var corps = "Demande d'adhésion à Entr'Aide et Culture (EAC)\n\n" +
        "Nom : " + g("nom") + "\nPrénom : " + g("prenom") + "\nEmail : " + g("email") + "\nTéléphone : " + g("tel") +
        "\nAdresse : " + g("adresse") + "\n\nType d'adhésion : " + g("type") +
        "\nEnfant(s) concerné(s) / niveau : " + g("enfants") + "\n\nMessage : " + g("message") +
        "\n\nJ'accepte les statuts et le règlement intérieur de l'association.";
      window.location.href = "mailto:" + C.email + "?subject=" + encodeURIComponent("Adhésion EAC - " + g("prenom") + " " + g("nom")) +
        "&body=" + encodeURIComponent(corps);
      document.getElementById("adhesion-ok").hidden = false;
    });
  }

  // Dons
  var fd = document.getElementById("form-don");
  if (fd) {
    var custom = document.getElementById("don-libre");
    fd.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (C.lienDon) { window.open(C.lienDon, "_blank", "noopener"); }
      else { document.getElementById("don-info").hidden = false; }
    });
    fd.querySelectorAll('input[name="montant"]').forEach(function (r) {
      r.addEventListener("change", function () { if (custom) custom.value = ""; });
    });
  }
})();
