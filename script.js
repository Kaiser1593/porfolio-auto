emailjs.init("zGg6PSsNVbHjx1E6U");

const form = document.getElementById("contact-form");
const message = document.getElementById("form-message");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    emailjs.sendForm("service_fube5n4", "template_portfolio", this)
      .then(() => {
        message.textContent = "Message envoyé avec succès !";
        message.style.color = "#4fd1c5";
        form.reset();
      })
      .catch((error) => {
        const detail = error && error.text ? ` (${error.text})` : "";
        message.textContent = "Erreur lors de l'envoi, réessayez plus tard." + detail;
        message.style.color = "#e57373";
        console.error("Erreur EmailJS :", error);
      });
  });
}
