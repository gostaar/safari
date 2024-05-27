fetch('../../../footer.html')
    .then(response => response.text())
    .then(html => {
        // Insérer le contenu du footer dans la balise <footer>
        document.getElementById('footer').innerHTML = html;
    })
    .catch(error => console.error('Erreur lors du chargement du footer:', error));