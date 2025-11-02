export async function loadLayout(contentPath) {
  const [layoutRes, contentRes] = await Promise.all([
    fetch("/template.html"),
    fetch(contentPath)
  ]);

  const layoutHTML = await layoutRes.text();
  const contentHTML = await contentRes.text();

  document.open();
  document.write(layoutHTML.replace("<!-- CONTENT_PLACEHOLDER -->", contentHTML));
  document.close();
}
