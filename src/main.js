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

// Verification
const idVerification = document.getElementById("verify-id");
const errorMessage = document.getElementById("no-holder");
const holderMessage = document.getElementById("holder");

// Verification - elements
const holderPicture = document.getElementById("holder-picture");
const holderName = document.getElementById("holder-name");
const holderId = document.getElementById("holder-id");
const holderYear = document.getElementById("holder-year");
const holderPrivilege = document.getElementById("holder-privilege");
const loader = document.getElementById("loader")

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://pwd-sc.onrender.com"

idVerification.addEventListener("keydown", async function(event) {
  if (event.key == "Enter") {
    event.preventDefault();
    
    const id = idVerification.value.trim();
    
    if (!id) return;

    try {
      loader.classList.remove("opacity-0")

      const response = await fetch(`${API_BASE}/api/holders/${encodeURIComponent(id)}`);
      const data = await response.json();

      loader.classList.add("opacity-0")

      if (data && Object.keys(data).length > 0) {
        // Found
        errorMessage.classList.add("opacity-0")
        holderMessage.classList.remove("opacity-0")
        
        holderPicture.src = data.picture + ".png";
        holderName.innerHTML = data.firstName + " " + data.lastName;
        holderId.innerHTML = "ID: " + data.id;
        holderYear.innerHTML = "Birth Year: " + data.birthYear;
        holderPrivilege.innerHTML = "Privilege: " + data.privilege;
      } else {
        // Not Found
        errorMessage.classList.remove("opacity-0")
        holderMessage.classList.add("opacity-0")
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }
});