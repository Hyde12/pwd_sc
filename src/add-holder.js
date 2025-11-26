document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    // TODO: Cloudbase R2 API for pictures, sql database management to add holders
    const iterator = formData.values();
    for (const foo of iterator) {
      console.log(`${foo}`);
    }
});