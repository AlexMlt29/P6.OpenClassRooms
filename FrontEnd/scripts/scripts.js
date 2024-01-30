document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5678/api/works')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        updatePortfolio(data); // Assurez-vous que cette fonction est celle que vous avez définie
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  });
  
  function updatePortfolio(works) {
    console.log(works); // Vérifiez les données reçues
    const gallery = document.querySelector('#portfolio .gallery'); // Ciblez le bon élément
    if (gallery) {
      gallery.innerHTML = ''; // Supprimez le contenu existant
  
      works.forEach(work => {
        const div = document.createElement('div');
        div.className = 'work-item';
        div.innerHTML = `
          <img src="${work.imageUrl}" alt="Image de ${work.title}">
          <figcaption>${work.title}</figcaption>`;
        gallery.appendChild(div);
      });
    } else {
      console.error("L'élément .gallery n'existe pas dans le DOM");
    }
}
  