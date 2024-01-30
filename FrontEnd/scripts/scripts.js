// Attache un écouteur d'événements qui exécute la fonction callback une fois que le contenu du DOM est chargé
document.addEventListener("DOMContentLoaded", function () {
  // Effectue une requête GET à l'API pour récupérer les données des travaux
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json()) // Convertit la réponse en JSON
    .then(updatePortfolio) // Appelle updatePortfolio avec les données JSON converties
    .catch((error) => console.error("Fetch operation error:", error)); // Capture et affiche les erreurs de la requête fetch
});

// Définit une fonction pour mettre à jour le contenu de la section portfolio
function updatePortfolio(works) {
  // Sélectionne l'élément du DOM où les travaux seront insérés
  const gallery = document.querySelector("#portfolio .gallery");

  // Vérifie si l'élément existe pour éviter les erreurs lors de l'accès à innerHTML
  if (gallery) {
    gallery.innerHTML = ""; // Efface le contenu actuel de l'élément gallery

    // Boucle sur chaque travail reçu de l'API
    works.forEach((work) => {
      const div = document.createElement("div"); // Crée un nouvel élément div
      div.className = "work-item"; // Attribue une classe pour le style
      // Définit le contenu HTML de div, y compris l'image et la légende avec les données du travail
      div.innerHTML = `
          <img src="${work.imageUrl}" alt="Image de ${work.title}">
          <figcaption>${work.title}</figcaption>`;
      gallery.appendChild(div); // Ajoute la div au conteneur gallery dans le DOM
    });
  }
}

// Fonction pour créer les boutons de filtre une fois que les données de catégorie sont récupérées
function createFilterButtons(categories) {
  const filterContainer = document.getElementById("filter-container"); // Assurez-vous que cet élément existe dans votre HTML
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.className = "filter-button";
    button.dataset.categoryId = category.id;
    button.addEventListener("click", () => filterWorksByCategory(category.id));
    filterContainer.appendChild(button);
  });
}

// Fonction pour filtrer les travaux par catégorie
function filterWorksByCategory(categoryId) {
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((works) => {
      const filteredWorks = categoryId === "Tous" ? works : works.filter((work) => work.category.id === categoryId);
      updatePortfolio(filteredWorks); // Mettez à jour l'affichage avec les travaux filtrés
    })
    .catch((error) => console.error("Error filtering works:", error));
}

// Fonction pour récupérer les catégories à partir des travaux
function getCategoriesFromWorks() {
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((works) => {
      // Crée un tableau de catégories uniques
      const categories = Array.from(new Set(works.map((work) => work.category.name))).map((name) => {
        return {
          id: works.find((work) => work.category.name === name).category.id,
          name: name,
        };
      });

      // Ajoute la catégorie "Tous" avec les id 1, 2 et 3
      categories.unshift({ id: "Tous", name: "Tous" });

      createFilterButtons(categories); // Crée les boutons de filtre avec ces catégories
    })
    .catch((error) => console.error("Fetch operation error:", error));
}

// Écouteur d'événements pour s'assurer que le DOM est chargé avant de créer les boutons de filtre
document.addEventListener("DOMContentLoaded", getCategoriesFromWorks);
