// Fetch initial des données du portfolio
function fetchPortfolioData() {
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((works) => {
      updatePortfolio(works);
    })
    .catch((error) => console.error("Fetch operation error:", error));
}

// Affichage galerie + Mise à jour du contenu du portfolio
function updatePortfolio(works) {
  const gallery = document.querySelector("#portfolio .gallery");
  if (gallery) {
    gallery.innerHTML = "";
    works.forEach((work) => {
      const div = document.createElement("figure");
      div.className = "work-item";
      div.innerHTML = `
        <img src="${work.imageUrl}" alt="Image de ${work.title}">
        <figcaption>${work.title}</figcaption>`;
      gallery.appendChild(div);
    });
  }
}

// Fonction pour récupérer les catégories et créer des boutons de filtre
function getCategoriesFromWorks() {
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((works) => {
      const categories = Array.from(new Set(works.map((work) => work.category.name))).map((name) => {
        return {
          id: works.find((work) => work.category.name === name).category.id,
          name: name,
        };
      });

      categories.unshift({ id: "tous", name: "Tous" });
      createFilterButtons(categories);
    })
    .catch((error) => console.error("Fetch operation error:", error));
}

// Fonction pour filtrer les travaux par catégorie
function filterWorksByCategory(categoryId) {
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((works) => {
      const filteredWorks = categoryId === "tous" ? works : works.filter((work) => work.category.id === categoryId);
      updatePortfolio(filteredWorks);
    })
    .catch((error) => console.error("Error filtering works:", error));
}

// Fonction pour créer des boutons de filtre dans l'UI
function createFilterButtons(categories) {
  const filterContainer = document.getElementById("filter-container");
  const buttonClasses = ["first-button", "second-button", "third-button", "fourth-button"];
  categories.forEach((category, index) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.className = buttonClasses[index] || "filter-default";
    button.dataset.categoryId = category.id;
    button.addEventListener("click", () => filterWorksByCategory(category.id));
    filterContainer.appendChild(button);
  });
}

// Gestion des sessions utilisateurs
function handleUserSession() {
  const authToken = localStorage.getItem("authToken");
  if (authToken) {
    displayLoggedInContent();
  } else {
    displayLoggedOutContent();
  }
}

// Affichage du contenu pour les utilisateurs connectés
function displayLoggedInContent() {
  document.querySelectorAll(".logged-out").forEach((el) => (el.style.display = "none"));
}

// Affichage du contenu pour les utilisateurs déconnectés
function displayLoggedOutContent() {
  document.querySelectorAll(".logged-in").forEach((el) => (el.style.display = "none"));
}

// Fonction de déconnexion
function logoutUser() {
  localStorage.removeItem("authToken");
  window.location.href = "./index.html";
}

// Appel des fonctions
fetchPortfolioData();
getCategoriesFromWorks();
handleUserSession();
