const modalPortfolio = document.getElementById("modal-portfolio");
const addModal = document.getElementById("modal-project");
const buttonOpenPortfolioModal = document.getElementById("project-button");
const spanClosePortfolioModal = document.getElementById("close-button");
const spanCloseAddModal = document.getElementById("close-add-button");
const btnOpenAddProjectModal = document.getElementById("add-button");
const returnToFirstModalButton = document.getElementById("arrow");
const addPhotoButton = document.querySelector(".button-photo");
const logoutLink = document.querySelector(".logout-link");
const fileInput = document.getElementById("file-input");
const imagePreview = document.getElementById("image-preview");
const backgroundPicture = document.getElementById("picture");
const buttonText = document.querySelector(".button-text");
const modalErrorMessage = document.getElementById("modal-error");
const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("category");
const validateButton = document.querySelector(".validation");
const addProjectForm = document.getElementById("add-project");

// Fonctions nommées pour le chargement du DOM
function onDOMContentLoaded() {
  fetchPortfolioData();
  getCategoriesFromWorks();
  handleUserSession();
  setupEventListeners();
}

// Fetch initial des données du portfolio
function fetchPortfolioData() {
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((works) => {
      updatePortfolio(works);
      updateModalPortfolio(works); // Appel à la fonction mise à jour pour le modal
    })
    .catch((error) => console.error("Fetch operation error:", error));
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
  const buttonClasses = ["filter-un", "filter-deux", "filter-trois", "filter-quatre"];
  categories.forEach((category, index) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.className = buttonClasses[index] || "filter-default";
    button.dataset.categoryId = category.id;
    button.addEventListener("click", () => filterWorksByCategory(category.id));
    filterContainer.appendChild(button);
  });
}

// Mise à jour du contenu du portfolio
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

// Configuration des écouteurs d'événements
function setupEventListeners() {
  buttonOpenPortfolioModal.onclick = () => openModal(modalPortfolio);
  spanClosePortfolioModal.onclick = () => closeModal(modalPortfolio);
  spanCloseAddModal.onclick = () => closeModal(addModal);
  btnOpenAddProjectModal.onclick = openAddProjectModal;
  returnToFirstModalButton.onclick = returnToFirstModal;
  addPhotoButton.onclick = () => fileInput.click();
  logoutLink.onclick = logoutUser;
  window.onclick = windowOnClick;
  fileInput.onchange = handleFileInputChange;
  titleInput.oninput = updateButtonState;
  categorySelect.onchange = updateButtonState;
  addProjectForm.onsubmit = addProject;
}

// Ouverture et fermeture des modaux
function openModal(modal) {
  if (modal) {
    modal.style.display = "flex";
    document.body.classList.add("modal-open");
  }
}

function closeModal(modal) {
  if (modal) {
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
  }
}

// Gestion de l'ouverture du modal d'ajout de projet
function openAddProjectModal() {
  closeModal(modalPortfolio);
  openModal(addModal);
}

// Retour au premier modal
function returnToFirstModal() {
  closeModal(addModal);
  openModal(modalPortfolio);
}

// Gestion du clic en dehors des modaux pour fermer
function windowOnClick(event) {
  if (event.target === modalPortfolio) {
    closeModal(modalPortfolio);
  }
  if (event.target === addModal) {
    closeModal(addModal);
  }
}

// Mise à jour de l'état du bouton de validation
function updateButtonState() {
  if (imagePreview.style.display !== "none" && titleInput.value.trim() !== "" && categorySelect.value !== "") {
    validateButton.style.backgroundColor = "#1D6154";
  } else {
    validateButton.style.backgroundColor = ""; // Remettre la couleur par défaut
  }
}

// Gestion du changement d'image
function handleFileInputChange() {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block";
      addPhotoButton.classList.add("hidden");
      buttonText.classList.add("hidden");
      backgroundPicture.classList.add("hidden");
    };
    reader.readAsDataURL(file);
  }
}

// Mise à jour de l'affichage du portfolio dans le modal
function updateModalPortfolio(works) {
  const modalGallery = document.querySelector("#modal-portfolio .modal-gallery");

  if (modalGallery) {
    modalGallery.innerHTML = "";

    works.forEach((work) => {
      const div = document.createElement("figure");
      div.className = "modal-item";
      div.innerHTML = `
            <div class="trash" data-work-id="${work.id}"><i class="fa-solid fa-trash-can"></i></div>
            <img src="${work.imageUrl}" alt="Image de ${work.title}">`;
      modalGallery.appendChild(div);

      // Attache l'écouteur d'événements pour la suppression ici
      div.querySelector(".trash").addEventListener("click", function () {
        handleTrashClick(work.id);
      });
    });
  }
}

// Gestion du clic sur l'icône de suppression
function handleTrashClick(workId) {
  deleteWorkById(workId);
}

// Suppression d'un travail par ID
function deleteWorkById(workId) {
  const url = `http://localhost:5678/api/works/${workId}`;

  fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        // Rafraîchit les données après suppression
        fetchPortfolioData();
      } else {
        alert("La suppression a échoué.");
      }
    })
    .catch((error) => {
      console.error("Erreur de réseau ou lors de la requête:", error);
    });
}

// Prévisualisation de l'image + Gestion de la taille maximale du fichier
function handleFileInputChange() {
  const file = fileInput.files[0];
  if (file) {
    if (file.size > 4 * 1024 * 1024) {
      // Gestion de la taille maximale du fichier
      modalErrorMessage.textContent = "L'image doit faire moins de 4 Mo.";
      modalErrorMessage.style.display = "flex";
      imagePreview.style.display = "none";
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block";
      addPhotoButton.classList.add("hidden-content");
      buttonText.classList.add("hidden-content");
      backgroundPicture.classList.add("hidden-content");
      modalErrorMessage.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
}

// Ajout d'un projet
function addProject(e) {
  e.preventDefault();
  const formData = new FormData();

  formData.append("title", document.getElementById("title").value);
  formData.append("category", document.getElementById("category").value);

  const imageInput = document.getElementById("file-input");
  formData.append("image", imageInput.files[0]);

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Échec de la création du projet: " + response.statusText);
      }
      return response.json();
    })
    .then(() => {
      // Rafraîchit les données après ajout
      fetchPortfolioData();
      returnToFirstModal();
    })
    .catch((error) => {
      console.error("Erreur:", error);
    });
}

// Initialisation
document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
