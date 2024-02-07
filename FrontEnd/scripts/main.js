////////////////////////////////////////////////////////// GALLERY ////////////////////////////////////////////////////////////

// Attache un écouteur d'événements qui exécute la fonction callback une fois que le contenu du DOM est chargé
document.addEventListener("DOMContentLoaded", function () {
  // Effectue une requête GET à l'API pour récupérer les données des travaux
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json()) // Convertit la réponse en JSON
    .then(updatePortfolio) // objet de la réponse est passé en argument automatiquement à la fonction (updatePortfolio) grace au .then
    // .then((works) => {
    //   updatePortfolio(works)}) // Appelle updatePortfolio avec les données JSON converties
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
      const div = document.createElement("figure"); // Crée un nouvel élément div
      div.className = "work-item"; // Attribue une classe pour le style
      // Définit le contenu HTML de div, y compris l'image et la légende avec les données du travail
      div.innerHTML = `
          <img src="${work.imageUrl}" alt="Image de ${work.title}">
          <figcaption>${work.title}</figcaption>`;
      gallery.appendChild(div); // Ajoute la div au conteneur gallery dans le DOM
    });
  }
}

//////////////////////////////////////////////////////////// FILTER ////////////////////////////////////////////////////////////

// Fonction pour créer les boutons de filtre une fois que les données de catégorie sont récupérées
function createFilterButtons(categories) {
  // Récupération de l'élément DOM avec l'identifiant 'filter-container'. Assurez-vous que cet élément existe dans votre code HTML.
  const filterContainer = document.getElementById("filter-container");

  // Boucle sur chaque objet catégorie dans le tableau des catégories.
  categories.forEach((category) => {
    // Crée un nouvel élément de bouton dans le DOM.
    const button = document.createElement("button");

    // Définit le texte du bouton avec la propriété 'name' de l'objet catégorie.
    button.textContent = category.name;

    // Ajoute une classe CSS 'filter-button' au bouton pour le styliser.
    button.className = "filter-button";

    // Ajoute un attribut de données personnalisé 'data-category-id' au bouton, contenant l'id de la catégorie.
    button.dataset.categoryId = category.id;

    // Attache un écouteur d'événements au bouton qui, lorsqu'il est cliqué, invoque la fonction filterWorksByCategory avec l'id de la catégorie comme argument.
    button.addEventListener("click", () => filterWorksByCategory(category.id));

    // Ajoute le bouton nouvellement créé à l'élément filterContainer dans le DOM.
    filterContainer.appendChild(button);
  });
}

// Fonction pour filtrer les travaux par catégorie
// Définit une fonction nommée filterWorksByCategory qui prend un categoryId en argument pour filtrer les travaux par catégorie.
function filterWorksByCategory(categoryId) {
  // Effectue une requête fetch pour obtenir les données des travaux depuis une API locale en utilisant l'URL fournie.
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json()) // Convertit la réponse de la requête en JSON.
    .then((works) => {
      // Utilise l'opérateur ternaire pour vérifier si categoryId est égal à "Tous". Si oui, il garde tous les travaux, sinon il filtre les travaux où l'id de la catégorie correspond à categoryId.
      const filteredWorks = categoryId === "Tous" ? works : works.filter((work) => work.category.id === categoryId);
      // Appelle la fonction updatePortfolio et lui passe les travaux filtrés pour mettre à jour l'affichage sur la page.
      updatePortfolio(filteredWorks);
    })
    .catch((error) => console.error("Error filtering works:", error)); // En cas d'échec de la requête, log l'erreur dans la console.
}

// Fonction pour récupérer les catégories à partir des travaux
// Fonction pour récupérer les catégories à partir d'un ensemble de travaux.
function getCategoriesFromWorks() {
  // Effectue une requête fetch à l'API pour obtenir tous les travaux disponibles.
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json()) // Convertit la réponse en format JSON.
    .then((works) => {
      // Crée un tableau de catégories uniques en mappant d'abord les noms des catégories dans les travaux,
      // en convertissant cette liste en un Set pour éliminer les doublons, puis en reconvertissant le Set en Array.
      const categories = Array.from(new Set(works.map((work) => work.category.name))).map((name) => {
        // Pour chaque nom de catégorie unique, trouve le premier travail correspondant et utilise son ID de catégorie,
        // créant ainsi un objet avec l'ID et le nom de la catégorie.
        return {
          id: works.find((work) => work.category.name === name).category.id,
          name: name,
        };
      });

      // Ajoute manuellement l'option "Tous" en tant que première catégorie dans la liste des catégories,
      // ce qui permettra de filtrer et d'afficher tous les travaux sans filtrage.
      categories.unshift({ id: "Tous", name: "Tous" });

      // Appelle la fonction createFilterButtons avec le tableau des catégories pour créer des boutons de filtre dans l'UI.
      createFilterButtons(categories);
    })
    .catch((error) => console.error("Fetch operation error:", error)); // En cas d'erreur pendant la requête fetch, log l'erreur dans la console.
}

// Écouteur d'événements pour s'assurer que le DOM est chargé avant de créer les boutons de filtre
document.addEventListener("DOMContentLoaded", getCategoriesFromWorks);

//////////////////////////////////////////////////////////// LOGGEG IN PAGE ////////////////////////////////////////////////////////////

// Attache un écouteur d'événements au document qui se déclenchera après le chargement complet du DOM.
document.addEventListener("DOMContentLoaded", (event) => {
  // Récupère la valeur de 'authToken' du stockage local du navigateur. Cette valeur est utilisée pour déterminer si l'utilisateur est actuellement connecté.
  const authToken = localStorage.getItem("authToken");

  // Vérifie si 'authToken' existe, ce qui indiquerait que l'utilisateur est connecté.
  if (authToken) {
    // Si un token d'authentification est présent, cela signifie que l'utilisateur est connecté.
    // Appelle la fonction displayLoggedInContent pour afficher les éléments de l'interface utilisateur réservés aux utilisateurs connectés.
    displayLoggedInContent();
  } else {
    // Si aucun token d'authentification n'est présent, cela signifie que l'utilisateur n'est pas connecté.
    // Appelle la fonction displayLoggedOutContent pour cacher les éléments de l'interface utilisateur qui sont seulement pour les utilisateurs connectés et/ou pour afficher les éléments pour les visiteurs non connectés.
    displayLoggedOutContent();
  }
});

// Fonction pour gérer l'affichage des éléments destinés aux utilisateurs connectés.
function displayLoggedInContent() {
  // Sélectionne tous les éléments HTML qui ont la classe 'logged-in'. Ces éléments sont supposés être visibles seulement pour les utilisateurs connectés.
  const loggedInElements = document.querySelectorAll(".logged-in");

  // Sélectionne tous les éléments HTML qui ont la classe 'logged-out'. Ces éléments sont supposés être cachés lorsque l'utilisateur est connecté.
  const loggedOutElements = document.querySelectorAll(".logged-out");

  // Parcourt tous les éléments destinés uniquement aux visiteurs non connectés et les cache en réglant leur propriété de style 'display' sur 'none'.
  // Cela les rend invisibles dans l'interface utilisateur.
  loggedOutElements.forEach((el) => (el.style.display = "none"));
}

// Fonction conçue pour gérer l'affichage des éléments de la page web lorsque l'utilisateur n'est pas connecté.
function displayLoggedOutContent() {
  // Sélectionne tous les éléments du document qui possèdent la classe 'logged-in'. Ces éléments sont généralement destinés à être affichés uniquement aux utilisateurs connectés.
  const loggedInElements = document.querySelectorAll(".logged-in");

  // Sélectionne tous les éléments du document qui possèdent la classe 'logged-out'. Ces éléments sont généralement destinés à être affichés uniquement aux utilisateurs non connectés.
  const loggedOutElements = document.querySelectorAll(".logged-out");

  // Parcourt tous les éléments qui sont censés être visibles uniquement pour les utilisateurs connectés et les cache en définissant leur propriété CSS 'display' sur 'none'.
  // Cette action rend ces éléments invisibles dans l'interface utilisateur, ce qui est l'effet inverse de ce que fait la fonction displayLoggedInContent.
  loggedInElements.forEach((el) => (el.style.display = "none"));
}

////////////////////////////////////////////////////////////// LOGOUT //////////////////////////////////////////////////////////////

// Fonction définie pour gérer la déconnexion d'un utilisateur.
function logoutUser() {
  // Supprime le token d'authentification du stockage local du navigateur.
  // C'est une étape de nettoyage courante lors de la déconnexion, car elle efface les preuves de l'authentification de l'utilisateur.
  localStorage.removeItem("authToken");

  // Redirige le navigateur vers 'index.html'.
  // Cela est généralement utilisé pour renvoyer l'utilisateur à la page de connexion ou à la page d'accueil du site après la déconnexion.
  window.location.href = "./index.html";
}

// Attachez cette fonction à votre bouton ou lien de déconnexion
document.querySelector(".logout-link").addEventListener("click", logoutUser);

//////////////////////////////////////////////////////////// MODAL PANEL ////////////////////////////////////////////////////////////

// Récupération des éléments
const modal = document.getElementById("modalPortfolio");
const addModal = document.getElementById("addProjectModal");
const button = document.getElementById("openModalButton");
const spanModal = document.getElementById("closeModalButton");
const spanAddModal = document.getElementById("closeAddModalButton");
const btnOpenAddProjectModal = document.getElementById("openAddProjectModalButton");
const returnFirstModal = document.getElementById("returnArrow");
const addPhotoButton = document.querySelector(".buttonAddPhoto");

// Attacher les écouteurs d'événements quand le modal s'ouvre
button.onclick = function () {
  modal.style.display = "block";
  document.body.classList.add("modal-open"); // Ajoute la classe pour empêcher le défilement

  // Attacher les écouteurs d'événements aux icônes de la corbeille ici
  attachDeleteEventListeners();
};

// Fermer le modal en cliquant sur le (x)
spanModal.onclick = function () {
  modal.style.display = "none";
  document.body.classList.remove("modal-open"); // Enlève la classe pour permettre le défilement
};

// Fermer le modal en cliquant sur le (x)
spanAddModal.onclick = function () {
  addModal.style.display = "none";
  document.body.classList.remove("modal-open"); // Enlève la classe pour permettre le défilement
};

// Gérez la fermeture du second modal lorsque l'utilisateur clique en dehors
window.onclick = function (event) {
  if (event.target == modalPortfolio) {
    modalPortfolio.style.display = "none";
  }
  if (event.target == addProjectModal) {
    addProjectModal.style.display = "none";
  }
  // Retirez les classes ajoutées au body si nécessaire
};

///////// close first and open second modal //////////

// Fonction pour ouvrir le second modal et fermer le premier
btnOpenAddProjectModal.onclick = function () {
  // Fermez le premier modal
  modalPortfolio.style.display = "none";
  // Ouvrez le second modal
  addProjectModal.style.display = "block";
  // Ajoutez une nouvelle classe au body si nécessaire pour empêcher le défilement pendant que le second modal est ouvert
};

returnFirstModal.onclick = function () {
  modalPortfolio.style.display = "block";

  addProjectModal.style.display = "none";
};

// Ajoutez un écouteur d'événements pour le clic
addPhotoButton.addEventListener("click", function () {
  // Déclenchez le clic sur l'input de type file
  document.getElementById("fileInput").click();
});

///////////////////// modal add photos /////////////////////

document.addEventListener('DOMContentLoaded', function() {
  const fileInput = document.getElementById('fileInput');
  const imagePreview = document.getElementById('imagePreview');
  const backgroundPicture = document.getElementById('picture');
  const addPhotoButton = document.querySelector('.buttonAddPhoto');
  const buttonText = document.querySelector('.buttonText');

  if (fileInput && imagePreview && addPhotoButton && buttonText) {
    fileInput.addEventListener('change', function() {
      var file = this.files[0];
      if (file && window.FileReader) {
        var reader = new FileReader();
        reader.onload = function(e) {
          imagePreview.src = e.target.result;
          imagePreview.style.display = 'block';
          addPhotoButton.classList.add('hidden-content');
          buttonText.classList.add('hidden-content');
          backgroundPicture.classList.add('hidden-content');
        };
        reader.readAsDataURL(file);
      }
    });
  }
});

//////// modal delete part galery JS ///////

function attachDeleteEventListeners() {
  document.querySelectorAll(".modal .trash").forEach((icon) => {
    // S'assurer de ne pas attacher plusieurs fois le même écouteur d'événement
    icon.removeEventListener("click", handleTrashClick);
    icon.addEventListener("click", handleTrashClick);
  });
}

function handleTrashClick(event) {
  event.preventDefault();
  event.stopPropagation();

  const workId = this.dataset.workId;
  deleteWorkById(workId);
}

function deleteWorkById(workId) {
  const url = `http://localhost:5678/api/works/${workId}`;

  fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      // Ajoutez d'autres en-têtes si nécessaire
    },
  })
    .then((response) => {
      if (response.ok) {
        // Si la requête a réussi, retirez l'élément du DOM ou mettez à jour l'interface utilisateur comme nécessaire
        // Par exemple, si chaque projet est dans une figure avec un id correspondant, on pourrait faire:
        document.querySelector(`[data-work-id="${workId}"]`).parentElement.remove();
      } else {
        // Si l'API retourne une erreur, vous pouvez gérer ici, comme afficher un message
        alert("La suppression a échoué.");
      }
    })
    .catch((error) => {
      // En cas d'erreur réseau ou d'erreur lors de l'exécution de la requête fetch
      console.error("Erreur de réseau ou lors de la requête:", error);
    });
}

//////////////////////////////////////////////////////////// MODAL DISPLAY GALERIE ////////////////////////////////////////////////////////////

// Attache un écouteur d'événements qui exécute la fonction callback une fois que le contenu du DOM est chargé
document.addEventListener("DOMContentLoaded", function () {
  // Effectue une requête GET à l'API pour récupérer les données des travaux
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json()) // Convertit la réponse en JSON
    .then(updateModalPortfolio) // objet de la réponse est passé en argument automatiquement à la fonction (updatePortfolio) grace au .then
    // .then((works) => {
    //   updatePortfolio(works)}) // Appelle updatePortfolio avec les données JSON converties
    .catch((error) => console.error("Fetch operation error:", error)); // Capture et affiche les erreurs de la requête fetch
});

// Définit une fonction pour mettre à jour le contenu de la section portfolio
function updateModalPortfolio(works) {
  // Sélectionne l'élément du DOM où les travaux seront insérés
  const modalGallery = document.querySelector("#modalPortfolio .modalGallery");

  // Vérifie si l'élément existe pour éviter les erreurs lors de l'accès à innerHTML
  if (modalGallery) {
    modalGallery.innerHTML = ""; // Efface le contenu actuel de l'élément gallery

    // Boucle sur chaque travail reçu de l'API
    works.forEach((work) => {
      const div = document.createElement("figure"); // Crée un nouvel élément div
      div.className = "modal-item"; // Attribue une classe pour le style
      // Définit le contenu HTML de div, y compris l'image et la légende avec les données du travail
      div.innerHTML = `
        <div class="trash" data-work-id="${work.id}"><i class="fa-solid fa-trash-can"></i></div>
        <img src="${work.imageUrl}" alt="Image de ${work.title}">`;
      modalGallery.appendChild(div);

      // Ajoutez immédiatement après avoir défini innerHTML
      div.querySelector(".trash").setAttribute("data-work-id", work.id);
    });
  }
}

//////////////////////////////////////////// TEST ////////////////////////////////////////////////////////////////
