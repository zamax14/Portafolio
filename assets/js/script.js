const header = document.querySelector("[data-header]");

function updateHeaderState() {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
}

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });
