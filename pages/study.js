document.addEventListener("DOMContentLoaded", () => {
  fetch("study.json")
    .then((res) => res.json())
    .then((resources) => renderResources(resources))
    .catch((err) => {
      document.getElementById("study-resources").innerHTML =
        "<p style='color:#FF00FF;text-align:center;'>Failed to load study resources.</p>";
    });
});

function renderResources(resources) {
  const container = document.getElementById("study-resources");
  container.innerHTML = "";
  if (!resources.length) {
    container.innerHTML = "<p style='text-align:center;'>No study resources yet.</p>";
    return;
  }
  resources.forEach((res) => {
    const card = document.createElement("div");
    card.className = "study-card";

    if (res.img) {
      const img = document.createElement("img");
      img.src = res.img;
      img.alt = res.title;
      img.className = "study-img";
      card.appendChild(img);
    }

    const title = document.createElement("a");
    title.href = res.url;
    title.target = "_blank";
    title.rel = "noopener";
    title.className = "study-title";
    title.textContent = res.title;
    card.appendChild(title);

    if (res.description) {
      const desc = document.createElement("p");
      desc.className = "study-desc";
      desc.textContent = res.description;
      card.appendChild(desc);
    }

    container.appendChild(card);
  });
}
