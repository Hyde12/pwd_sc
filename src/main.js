// Theme toggle 
const btn = document.getElementsByClassName('theme-toggle');

if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

for (let i = 0; i < btn.length; i++) {
  if (btn[i]) {
      btn[i].addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.theme = isDark ? 'dark' : 'light';
    });
  }
}

// Sidebar
const toggleOpen = document.getElementById('toggleOpen');
const toggleClose = document.getElementById('toggleClose');
const collapseMenu = document.getElementById('collapseMenu');

function handleClick() {
  if (!collapseMenu) return;
  collapseMenu.style.display =
    collapseMenu.style.display === 'block' ? 'none' : 'block';
}

if (toggleOpen && toggleClose) {
  toggleOpen.addEventListener('click', handleClick);
  toggleClose.addEventListener('click', handleClick);
}

// --- Sidebar toggle function ---
export function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (!sidebar || !overlay) return;

  const isHidden = sidebar.classList.toggle("-translate-x-full");

  if (!isHidden) {
    overlay.classList.remove("hidden");
    overlay.classList.add("opacity-50");
  } else {
    overlay.classList.add("hidden");
    overlay.classList.remove("opacity-50");
  }
}

document.querySelectorAll("[data-toggle='sidebar']").forEach(button => {
  button.addEventListener("click", toggleSidebar);
});