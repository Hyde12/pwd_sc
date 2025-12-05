const holdersTableBody = document.getElementById("holders-table-body"); 
const unverifiedHoldersTableBody = document.getElementById("unverified-holders-table-body");
const loader = document.getElementById("loader");
const loader2 = document.getElementById("loader-2");
const errorMessage = document.getElementById("error-message");
const errorMessage2 = document.getElementById("error-message-2");

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://pwd-sc.onrender.com";

async function loadAllHolders() {
  holdersTableBody.innerHTML = ''; 
  errorMessage.classList.add("hidden"); 
  loader.classList.remove("hidden"); 

  try {
    const response = await fetch(`${API_BASE}/api/verifiedholders`); 

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const holders = await response.json();

    loader.classList.add("hidden"); 

    if (holders && Array.isArray(holders) && holders.length > 0) {
      holders.forEach(holder => {
        const row = document.createElement("tr");
        let status = ""
        if (holder.seniorCitizen && holder.disability) {
            status = "Senior Citizen - " + holder.disability;
        }
        else if (holder.seniorCitizen) {
            status = "Senior Citizen";
        } 
        else if (holder.disability) {
            status = holder.disability;
        }
        
        row.className = "bg-color-offwhite text-yellow-text border-b border-dark-2 bg-light-4 dark:bg-dark-4 hover:bg-light-1 dark:hover:bg-dark-1 text-center transition duration-150";

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <img src="${holder.picture}.png" alt="${holder.firstName}" class="w-10 h-10 rounded-full mx-auto" onerror="this.onerror=null; this.src='placeholder.png';">
            </td>
            <td class="px-6 py-4 **text-color-dark-1**">
                ${holder.firstName} ${holder.lastName}
            </td>
            <td class="px-6 py-4 text-center **text-color-dark-2**">
                ${holder.id}
            </td>
            <td class="px-6 py-4 text-center **text-color-dark-2**">
                ${holder.birthDate}
            </td>
            <td class="px-6 py-4 text-center">
                <span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:text-green-300 dark:bg-green-700">
                    ${status}
                </span>
            </td>
        `;
        holdersTableBody.appendChild(row);
      });
    } else {
      errorMessage.textContent = "No holders found in the database.";
      errorMessage.classList.remove("hidden");
    }

  } catch (err) {
    console.error("Fetch error:", err);
    loader.classList.add("hidden");
    errorMessage.textContent = `Error loading data: ${err.message}`;
    errorMessage.classList.remove("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
    loadAllHolders();
});