function loginUser(event) {
  event.preventDefault();

  // Récupère les valeurs des champs de formulaire
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Exécute la requête de connexion
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, password: password }),
  })
    .then((response) => {
      if (!response.ok) {
        showError("Erreur dans l’identifiant ou le mot de passe.");
        throw new Error("Erreur dans l’identifiant ou le mot de passe.");
      }
      return response.json();
    })
    .then((data) => {
      localStorage.setItem("authToken", data.token); // Stocke le token d'authentification
      window.location.href = "./index.html";
    })
    .catch((error) => {
      showError("Erreur dans l’identifiant ou le mot de passe.");
    });
}

function showError(message) {
  const errorDiv = document.getElementById("error-message");
  if (errorDiv) {
    errorDiv.textContent = message;

    errorDiv.style.display = "block";
  }
}

document.getElementById("login-form").addEventListener("submit", loginUser);
