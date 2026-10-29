
// ── Typewriter effect ──────────────────────────────────────────
(function () {
  const fullText = 'Siraj Masoud';
  const target = document.getElementById('typewriter-text');
  const cursor = document.querySelector('.cursor');
  let index = 0;

  function type() {
    if (index <= fullText.length) {
      target.textContent = fullText.slice(0, index);
      index++;
      setTimeout(type, 110);
    } else {
      // keep blinking cursor after typing is done
      cursor.style.animation = 'cursorBlink 0.8s step-end infinite';
    }
  }

  // small delay so the page renders first
  setTimeout(type, 400);
})();

// ── Active nav link highlight on scroll ───────────────────────
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
// Throttled to one update per animation frame (was: layout read on every scroll event)
let scrollTicking = false;
function updateActiveLink() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80;
    if (window.pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
  scrollTicking = false;
}
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(updateActiveLink);
  }
}, { passive: true });

document.getElementById("contactForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = {
    name: this.name.value,
    email: this.email.value,
    message: this.message.value
  };

  try {
    const response = await fetch("https://formspree.io/f/xyzbjpbq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      alert("Message sent successfully!");
      this.reset();
    } else {
      alert("Error sending message. Try again.");
    }
  } catch (err) {
    // network failure (offline, blocked request, etc.)
    alert("Network error. Please check your connection and try again.");
  }
});
