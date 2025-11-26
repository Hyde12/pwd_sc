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