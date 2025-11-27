const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://pwd-sc.onrender.com"

function populateBirthYearSelector() {
    const select = document.getElementById('birth_year');
    const currentYear = new Date().getFullYear();
    const startYear = 1900; // Start range from 1900

    // Loop backwards from the current year to the start year
    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        select.appendChild(option);
    }
}

document.getElementById("form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const data = Object.fromEntries(formData.entries());

    try {
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

        const result = await response.json();
        console.log("Success:", result);

    } catch (error) {
        console.error("Error making POST request:", error.message);
    }

    console.log(data.first_name)
});

populateBirthYearSelector();