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

        let status = ""
        console.log(data.seniorCitizen)
        if (data.seniorCitizen && data.disability) {
            status = "Senior Citizen - " + data.disability;
        }
        else if (data.seniorCitizen) {
            status = "Senior Citizen";
        } 
        else if (data.disability) {
            status = data.disability;
        }
        console.log(data.seniorCitizen)
        holderPicture.src = data.picture + ".png";
        holderName.innerHTML = data.firstName + " " + data.lastName;
        holderId.innerHTML = "ID: " + data.id;
        holderYear.innerHTML = data.birthDate;
        holderPrivilege.innerHTML = status;
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

const picture = document.getElementById('holder-picture');

picture.addEventListener('click', evt => {
    if (picture.classList.contains('zoomed'))
      picture.style.transform = ''
    else {
      const myScale = 700 / picture.clientWidth
      picture.style.transform = `scale(${myScale})`
    }
    picture.classList.toggle('zoomed')
  });