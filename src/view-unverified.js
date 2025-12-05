const unverifiedHoldersTableBody = document.getElementById("unverified-holders-table-body");
const loader2 = document.getElementById("loader-2");
const errorMessage2 = document.getElementById("error-message-2");

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://pwd-sc.onrender.com";

async function verifyHolder(id) {
  try {
        const new_holder = await fetch(`${API_BASE}/api/unverifiedholders/${encodeURIComponent(id)}`);
        const data = await new_holder.json();
        console.log(data)

        const response = await fetch(`${API_BASE}/api/holders/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorData.error}`);
        }

        removeHolder(id);
        const result = await response.json();
        console.log("Success:", result);
    } catch (error) {
        console.error("Error making request:", error.message);
    }
}

async function removeHolder(id) {
  try {
        const response = await fetch(`${API_BASE}/api/verification/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const result = await response.json();
        console.log("Success:", result);
        location.reload();

    } catch (error) {
        console.error("Error making request:", error.message);
    }
}

async function loadAllUnverifiedHolders() {
  unverifiedHoldersTableBody.innerHTML = ''; 
  errorMessage2.classList.add("hidden"); 
  loader2.classList.remove("hidden"); 

  try {
    const response = await fetch(`${API_BASE}/api/unverifiedholders`); 

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const holders = await response.json();

    loader2.classList.add("hidden"); 

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
            <td class="px-6 py-4 text-center">
                <!-- Verify Button (Green) --> 
                <button data-action="verify" data-id="${holder.id}" class="text-xs font-medium px-2 py-1 rounded-full text-white bg-green-600 hover:bg-green-700 transition duration-150 shadow-md">
                  Verify 
                </button> 
                
                <!-- Remove Button (Red) --> 
                <button data-action="remove" data-id="${holder.id}" class="text-xs font-medium px-2 py-1 rounded-full text-white bg-red-600 hover:bg-red-700 transition duration-150 shadow-md">
                  Remove 
                </button>
                
                <!-- View Button (Blue) -->
                <button data-action="view" data-id="${holder.id}" class="text-xs font-medium px-2 py-1 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition duration-150 shadow-md">
                  Review
                </button>
            </td>
        `;
        unverifiedHoldersTableBody.appendChild(row);
      });
    } else {
      errorMessage2.textContent = "No holders found in the database.";
      errorMessage2.classList.remove("hidden");
    }

  } catch (err) {
    console.error("Fetch error:", err);
    loader2.classList.add("hidden");
    errorMessage2.textContent = `Error loading data: ${err.message}`;
    errorMessage2.classList.remove("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
    loadAllUnverifiedHolders();

    unverifiedHoldersTableBody.addEventListener('click', (event) => {
        const button = event.target.closest('button');

        if (button) {
            const id = button.dataset.id;
            const action = button.dataset.action;

            if (action === 'verify') {
              if (confirm(`Are you sure you want to verify this holder?`)) {
                    verifyHolder(id);
                }
            } else if (action === 'remove') {
                // You may want a confirmation prompt here!
                if (confirm(`Are you sure you want to remove this holder?`)) {
                    removeHolder(id);
                }
            } else if (action === 'view') {
                // Assuming you have a viewHolder function defined elsewhere
                viewHolder(id); 
            }
        }
    });
});