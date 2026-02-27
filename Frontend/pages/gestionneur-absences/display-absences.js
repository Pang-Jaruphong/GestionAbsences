async function fetchAndDisplayAbsences() {
    const container = document.getElementById('absences-container');

    try {
        // 1. Appel à ton API (ajuste l'URL selon ton port Express, ex: 3000)
        const response = await fetch('http://localhost:4000/absences');

        if (!response.ok) throw new Error("Erreur lors de la récupération");

        const absences = await response.json();

        // 2. On vide le message de chargement
        container.innerHTML = '';

        // 3. On boucle sur les données reçues
        absences.forEach(abs => {
            // Création d'une ligne d'absence
            const row = document.createElement('div');
            row.className = 'absence';

            // Injection des données SQL (vérifie bien les noms des colonnes SQL)
            row.innerHTML = `
                <span>${abs.Lastname}</span>
                <span>${abs.Firstname}</span>
                <span>${abs.Status}</span>
                <span>${abs.Period}</span>
                <span>${abs.Raison || '-'}</span>
                <span>${abs.Justificatif}</span>
            `;

            container.appendChild(row);
        });

    } catch (error) {
        console.error("Erreur détaillée:", error);
        container.innerHTML = `<p style="color: red;">Erreur: ${error.message}</p>`;
    }
}

// Lancer la fonction au chargement de la page
window.addEventListener('DOMContentLoaded', fetchAndDisplayAbsences);