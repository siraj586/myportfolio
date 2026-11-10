
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

// ── GSAP animations ───────────────────────────────────────────
(function () {
  // Safety net: if the CDN failed to load GSAP, show everything normally.
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.documentElement.classList.remove('js');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // matchMedia: the animations below only exist while this media query is
  // true. Users who asked their OS for reduced motion get a static page.
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    // Shared settings. We only animate opacity + transform (y / scale):
    // the browser can do those on the GPU without recalculating layout.
    // "autoAlpha" = opacity + visibility together.
    const hidden = { autoAlpha: 0, y: 40 };
    const shown = { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' };

    // Helper: fade elements up once, when they scroll into view.
    function revealOnScroll(targets, from = hidden, to = shown) {
      gsap.utils.toArray(targets).forEach((el) => {
        gsap.fromTo(el, from, {
          ...to,
          scrollTrigger: {
            trigger: el,
            // when the element's top hits 85% of the viewport height.
            // clamp() keeps that point reachable for elements at the very
            // bottom of the page, which can never scroll that high.
            start: 'clamp(top 85%)',
            once: true,
          },
        });
      });
    }

    // Helper: reveal a group of items with a stagger. "batch" groups the
    // items that enter the viewport together, so it works whether the
    // grid shows 4 columns (desktop) or 1 column (phone).
    function revealBatch(targets) {
      gsap.set(targets, hidden);
      ScrollTrigger.batch(targets, {
        start: 'clamp(top 90%)',
        once: true,
        onEnter: (batch) => gsap.to(batch, { ...shown, stagger: 0.12 }),
      });
    }

    // 1) Hero: subtitle then button, while the typewriter is typing
    gsap.fromTo('.hero-reveal', hidden, { ...shown, delay: 0.6, stagger: 0.25 });

    // 2) Section titles, About content, contact form
    revealOnScroll('section:not(.hero-section) h2');
    revealOnScroll(
      '.about-section img',
      { ...hidden, scale: 0.95 },
      { ...shown, scale: 1 }
    );
    revealOnScroll('.about-section p, .about-section .skill-bars');
    revealOnScroll('.contact-form, .social-links');

    // 3) Project cards + skills, staggered.
    // Note: we animate the Bootstrap column, NOT .project-card itself —
    // the card already uses "transform" for its CSS hover effect, and
    // two things animating the same property would fight each other.
    revealBatch('.projects-section .row > div');
    revealBatch('.skills-section .row > div');

    // 4) Skill bars fill up, and the percentage counts from 0
    gsap.utils.toArray('.progress-bar').forEach((bar) => {
      gsap.from(bar, {
        scaleX: 0,
        duration: 1.2,
        delay: 0.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: bar, start: 'clamp(top 92%)', once: true },
      });
    });

    const labels = gsap.utils.toArray('.skill-percent');
    const finalTexts = labels.map((label) => label.textContent);

    labels.forEach((label) => {
      const counter = { value: 0 };
      const end = parseInt(label.textContent, 10);
      gsap.to(counter, {
        value: end,
        duration: 1.2,
        delay: 0.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: label, start: 'clamp(top 92%)', once: true },
        onUpdate: () => {
          label.textContent = Math.round(counter.value) + '%';
        },
      });
    });

    // Cleanup: if the user turns reduced motion ON while the page is open,
    // GSAP reverts the tweens; this puts the numbers back too.
    return () => {
      labels.forEach((label, i) => {
        label.textContent = finalTexts[i];
      });
    };
  });
})();
