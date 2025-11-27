// Verification
const idVerification = document.getElementById("verify-id");
const errorMessage = document.getElementById("no-holder");
const holder = document.getElementById("holder")

// Verification - elements
const holderData = document.getElementById("holder-data");
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
      loader.classList.remove("hidden")

      const response = await fetch(`${API_BASE}/api/holders/${encodeURIComponent(id)}`);
      const data = await response.json();

      loader.classList.add("hidden")

      if (data && Object.keys(data).length > 0) {
        // Found
        errorMessage.classList.add("hidden")
        holderData.classList.remove("hidden")
        holder.classList.remove("hidden")
        
        holderPicture.src = data.picture + ".png";
        holderName.innerHTML = data.firstName + " " + data.lastName;
        holderId.innerHTML = "ID: " + data.id;
        holderYear.innerHTML = data.birthYear;
        holderPrivilege.innerHTML = data.privilege;
      } else {
        // Not Found
        errorMessage.classList.remove("hidden")
        holderData.classList.add("hidden")
        holder.classList.add("hidden")
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }
});