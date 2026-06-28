const header = document.querySelector("[data-header]");
const revealItems = document.querySelectorAll("[data-reveal]");
const skillTabs = document.querySelectorAll("[data-skill-tab]");
const skillPanels = document.querySelectorAll("[data-skill-panel]");
const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-project-category]");

function updateHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 8);
}

function showSkillPanel(skill) {
  skillTabs.forEach((tab) => {
    const active = tab.dataset.skillTab === skill;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  skillPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.skillPanel === skill);
  });
}

function filterProjects(filter) {
  filterButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === filter);
  });

  projectCards.forEach((card) => {
    const categories = card.dataset.projectCategory.split(" ");
    const visible = filter === "all" || categories.includes(filter);
    card.classList.toggle("is-hidden", !visible);
  });
}

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    )
  : null;

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

skillTabs.forEach((tab) => {
  tab.addEventListener("click", () => showSkillPanel(tab.dataset.skillTab));
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => filterProjects(button.dataset.filter));
});

revealItems.forEach((item) => {
  if (revealObserver) {
    revealObserver.observe(item);
  } else {
    item.classList.add("is-visible");
  }
});
