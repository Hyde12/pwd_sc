const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://pwd-sc.onrender.com"

document.getElementById("form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const data = Object.fromEntries(formData.entries());

    const isSixtyOrOlder = (dateString) => {
        const today = new Date();
        const birthDate = new Date(dateString);
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        
        // Adjust age if the birthday hasn't occurred yet this year
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 60;
    };

    const seniorCitizenStatus = isSixtyOrOlder(data.birth_date);
    console.log(seniorCitizenStatus)
    if (!seniorCitizenStatus && (!data.category || data.category === "")) {
        console.error("Validation Failed: Holder is not a senior citizen and 'Category' field is empty.");
        alert("You must select a category for non-senior citizen holders.");
        
        return; 
    }

    const submissionData = {
        first_name: data.first_name,
        last_name: data.last_name,
        birth_date: String(data.birth_date),
        picture: data.picture || null,
        disability: data.category || null,
        senior_citizen: seniorCitizenStatus
    };
    console.log(JSON.stringify(submissionData))
    try {
        const response = await fetch(`${API_BASE}/api/holders/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(submissionData)
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

document.addEventListener('DOMContentLoaded', () => {
    const isPwdCheckbox = document.getElementById('is_pwd');
    const categoryField = document.getElementById('category_field');
    const categorySelect = document.getElementById('category');

    const toggleCategoryVisibility = () => {
        if (isPwdCheckbox.checked) {
            categoryField.style.display = 'block';
            // Make the select field required only when it's visible
            categorySelect.setAttribute('required', 'required');
        } else {
            categoryField.style.display = 'none';
            // Remove required attribute when hidden
            categorySelect.removeAttribute('required');
            // Optional: Reset the selected value when hidden
            categorySelect.value = '';
        }
    };

    // Initial check when the page loads
    toggleCategoryVisibility();

    // Listen for changes on the checkbox
    isPwdCheckbox.addEventListener('change', toggleCategoryVisibility);
});