export async function loadLayout(contentPath) {
  const [layoutRes, contentRes] = await Promise.all([
    fetch("../template.html"),
    fetch(contentPath)
  ]);

  let layoutHTML = await layoutRes.text();
  const contentHTML = await contentRes.text();

  // Insert content and title
  layoutHTML = layoutHTML
    .replace("<!-- CONTENT_PLACEHOLDER -->", contentHTML)

  // Replace the document with the built layout
  document.open();
  document.write(layoutHTML);
  document.close();
}