const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.getElementById("year").textContent = new Date().getFullYear();

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");

menuToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealItems = document.querySelectorAll(".reveal");
if (reduceMotion) {
  revealItems.forEach((item) => item.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );
  revealItems.forEach((item) => revealObserver.observe(item));
}

const countItems = document.querySelectorAll("[data-count]");
let countStarted = false;
const animateCount = (element) => {
  const target = Number(element.dataset.count);
  const suffix = element.dataset.suffix || "";
  const duration = 1200;
  const start = performance.now();

  const tick = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const proofStrip = document.querySelector(".proof-strip");
if (proofStrip && !reduceMotion) {
  const proofObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting) && !countStarted) {
        countStarted = true;
        countItems.forEach(animateCount);
        proofObserver.disconnect();
      }
    },
    { threshold: 0.45 }
  );
  proofObserver.observe(proofStrip);
}

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".site-nav > a[href^='#']")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  },
  { rootMargin: "-40% 0px -50%", threshold: 0 }
);
sections.forEach((section) => sectionObserver.observe(section));

const filterButtons = document.querySelectorAll(".filter-button");
const archiveCards = document.querySelectorAll(".archive-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    archiveCards.forEach((card) => {
      const matches = filter === "all" || card.dataset.tags.split(" ").includes(filter);
      card.classList.toggle("is-hidden", !matches);
    });
  });
});

if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
  const glow = document.querySelector(".cursor-glow");
  document.body.classList.add("has-pointer");
  window.addEventListener("pointermove", (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  });
}
