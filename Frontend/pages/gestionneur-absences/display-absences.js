async function fetchAndDisplayAbsences() {
    const container = document.getElementById('absences-container');

    try {
        // 1. Appel à ton API (ajuste l'URL selon ton port Express, ex: 3000)
        const response = await fetch('http://localhost:4000/absences');

        if (!response.ok) throw new Error("Erreur lors de la récupération");

        const absences = await response.json();

        if (absences.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9">Aucune absence trouvée.</td></tr>';
            return;
        }

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
                <span>${abs.Justificatif}</span>
                <span>${abs.Raison || '-'}</span>
                <span>${new Date(abs.Date).toLocaleDateString('fr-FR')}</span>                
                <span>${abs.Period}</span>
                <span>${abs.Begin}</span>
                <span>${abs.End}</span>
                <button class="btn-delete" data-id="${abs.id}">✕</button>            
`;

            const deleteBtn = row.querySelector('.btn-delete');
            deleteBtn.addEventListener('click', async () => {
                deleteBtn.disabled = true;

                try {
                    const response = await fetch(`http://localhost:4000/absences/${abs.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    if (response.ok) {
                        row.remove();
                        console.log("Suppression réussie côté serveur et client.");
                    } else {
                        const data = await response.json();
                        alert(data.message || "Erreur lors de la suppression");
                        deleteBtn.disabled = false;
                    }
                } catch (error) {
                    console.error("Erreur fetch:", error);
                }
            });
            container.appendChild(row);
        });

    } catch (error) {
        console.error("Erreur détaillée:", error);
        container.innerHTML = `<p style="color: red;">Erreur: ${error.message}</p>`;
    }
}

// Lancer la fonction au chargement de la page
window.addEventListener('DOMContentLoaded', fetchAndDisplayAbsences);