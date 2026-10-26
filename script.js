// =========================================================
// Timeless Aesthetics - site behaviour
// =========================================================

// >>> CHANGE THIS to Christine's real email address <<<
// (it is also shown in the Contact section of index.html)
const CONTACT_EMAIL = "YOUR-EMAIL@example.com";

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Mobile menu ----------
const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");

function closeMenu() {
  siteNav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
}

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close the menu after tapping a link, or pressing Escape
siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

// ---------- Fade-in on scroll ----------
const revealTargets = document.querySelectorAll(
  ".card, .price-group, .about-text, .about-card, .location-list li, .contact-info, .contact-form"
);
revealTargets.forEach((el) => el.classList.add("reveal"));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealTargets.forEach((el) => observer.observe(el));
} else {
  // Older browsers: just show everything
  revealTargets.forEach((el) => el.classList.add("visible"));
}

// ---------- Contact form ----------
// This site has no server, so the form opens the visitor's email app
// with the message pre-filled. To receive messages directly instead,
// you can later connect a form service (e.g. Formspree or Web3Forms).
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

// Keep the visible email link in sync with the constant above
const emailLink = document.getElementById("emailLink");
if (emailLink) {
  emailLink.href = "mailto:" + CONTACT_EMAIL;
  emailLink.textContent = CONTACT_EMAIL;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  statusEl.className = "form-status";
  statusEl.textContent = "";

  const fields = form.querySelectorAll("[required]");
  let firstInvalid = null;

  fields.forEach((field) => {
    const valid = field.checkValidity() && field.value.trim() !== "";
    field.classList.toggle("invalid", !valid);
    if (!valid && !firstInvalid) firstInvalid = field;
  });

  if (firstInvalid) {
    statusEl.classList.add("error");
    statusEl.textContent = "Please complete the highlighted fields.";
    firstInvalid.focus();
    return;
  }

  const data = new FormData(form);
  const treatment = data.get("treatment") || "General query";

  const subject = `Website enquiry: ${treatment}`;
  const body = [
    `Name: ${data.get("firstName")} ${data.get("lastName")}`,
    `Email: ${data.get("email")}`,
    `Phone: ${data.get("phone")}`,
    `Treatment: ${treatment}`,
    "",
    data.get("message"),
  ].join("\n");

  window.location.href =
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  statusEl.classList.add("ok");
  statusEl.textContent = "Thank you! Your email app should now open so you can send your message.";
});

// Clear the red highlight as soon as the user fixes a field
form.addEventListener("input", (e) => {
  if (e.target.classList.contains("invalid")) {
    e.target.classList.remove("invalid");
  }
});