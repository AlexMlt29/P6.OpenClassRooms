//////////////////////////////////////////////////////////////// LOGIN ////////////////////////////////////////////////////////////////

// Ajoute un écouteur d'événements de soumission ('submit') au formulaire avec l'ID 'login-form'.
document.getElementById('login-form').addEventListener('submit', function(event) {
    // Empêche le comportement par défaut de l'événement de soumission, qui est de recharger la page.
    event.preventDefault();

    // Récupère la valeur entrée par l'utilisateur dans le champ d'entrée avec l'ID 'email'.
    const email = document.getElementById('email').value;
    // Récupère la valeur entrée par l'utilisateur dans le champ d'entrée avec l'ID 'password'.
    const password = document.getElementById('password').value;

    // Envoie une requête HTTP POST asynchrone au serveur local pour la route '/api/users/login'.
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST', // Spécifie la méthode HTTP de la requête.
        headers: {
            'Content-Type': 'application/json', // Définit le type de contenu de la requête comme JSON.
        },
        body: JSON.stringify({ email: email, password: password }), // Convertit les données de l'email et du mot de passe en chaîne JSON pour le corps de la requête.
    })
    .then(response => {
        // Première fonction de rappel pour gérer la réponse.
        if (!response.ok) {
            // Si la réponse du serveur n'est pas 'ok' (erreur 200-299), affiche un message d'erreur.
            showError('Erreur dans l’identifiant ou le mot de passe.');
            // Lance une nouvelle erreur pour arrêter l'exécution des prochaines promesses.
            throw new Error('Erreur dans l’identifiant ou le mot de passe.');
        }
        // Si la réponse est 'ok', convertit le corps de la réponse de JSON en objet JavaScript.
        return response.json();
    })
    .then(data => {
        // Seconde fonction de rappel pour gérer les données de la réponse.
        // Stocke le token d'authentification reçu dans le stockage local du navigateur.
        localStorage.setItem('authToken', data.token);
        // Redirige l'utilisateur vers la page d'accueil après une connexion réussie.
        window.location.href = './index.html';
    })
    .catch(error => {
        // Gère les erreurs qui surviennent pendant la requête fetch ou dans les promesses.
        showError('Erreur dans l’identifiant ou le mot de passe.'); // Affiche un message d'erreur générique.
    });
});

// Définit la fonction 'showError' pour afficher les messages d'erreur.
function showError(message) {
    // Récupère l'élément du DOM destiné à afficher les messages d'erreur par son ID.
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        // Si l'élément existe, définit son contenu de texte avec le message d'erreur.
        errorDiv.textContent = message;
        // Rend l'élément d'erreur visible en modifiant son style de display.
        errorDiv.style.display = 'block';
    }
}
