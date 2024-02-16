const modalPortfolio = document.getElementById("modal-portfolio");
const addModal = document.getElementById("modal-project");
const buttonOpenPortfolioModal = document.getElementById("project-button");
const spanClosePortfolioModal = document.getElementById("close-button");
const spanCloseAddModal = document.getElementById("close-add-button");
const btnOpenAddProjectModal = document.getElementById("add-button");
const returnToFirstModalButton = document.getElementById("arrow");
const addPhotoButton = document.querySelector(".button-photo");
const fileInput = document.getElementById("file-input");
const imagePreview = document.getElementById("image-preview");
const backgroundPicture = document.getElementById("picture");
const buttonText = document.querySelector(".button-text");
const modalErrorMessage = document.getElementById("modal-error");
const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("category");
const validateButton = document.querySelector(".validation");
const addProjectForm = document.getElementById("add-project");
const logoutLink = document.querySelector(".logout-link");

// Fonctions nommées pour le chargement du DOM
function onDOMContentLoaded() {
  fetchModalPortfolioData();
  setupEventListeners();
}

// Fetch initial des données du portfolio
function fetchModalPortfolioData() {
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((works) => {
      updateModalPortfolio(works); // Appel à la fonction mise à jour pour le modal
    })
    .catch((error) => console.error("Fetch operation error:", error));
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
  buttonOpenPortfolioModal.addEventListener("click", () => openModal(modalPortfolio));
  spanClosePortfolioModal.addEventListener("click", () => closeModal(modalPortfolio));
  spanCloseAddModal.addEventListener("click", () => closeModal(addModal));
  btnOpenAddProjectModal.addEventListener("click", openAddProjectModal);
  returnToFirstModalButton.addEventListener("click", returnToFirstModal);
  addPhotoButton.addEventListener("click", () => fileInput.click());
  window.addEventListener("click", windowOnClick);
  fileInput.addEventListener("change", handleFileInputChange);
  titleInput.addEventListener("input", updateButtonState);
  categorySelect.addEventListener("change", updateButtonState);
  addProjectForm.addEventListener("submit", addProject);
  logoutLink.addEventListener("click", logoutUser);
}

function closeModal(modal) {
  if (modal) {
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
  }
}

// Ouverture et fermeture des modaux
function openModal(modal) {
  if (modal) {
    modal.style.display = "flex";
    document.body.classList.add("modal-open");
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

// Gestion de l'upload de l'image
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
        fetchModalPortfolioData();
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
      fetchModalPortfolioData();
      returnToFirstModal();
    })
    .catch((error) => {
      console.error("Erreur:", error);
    });
}

// Initialisation
document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
