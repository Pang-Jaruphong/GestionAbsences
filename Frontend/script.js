// Aider par Gemini
// sélectionner le formulaire dans le HTML
const logFormulaire = document.querySelector('.formLogin');

logFormulaire.addEventListener('submit',async function (evenement) {
    // Empêcher la page de se rafraîchir
    evenement.preventDefault()

    // récupérer ce que l'utilisateur a tapé
    const emailValue = document.getElementById('exampleInputEmail1').value;
    const passwordValue = document.getElementById('exampleInputPassword1').value;

    try {
        // envoie des données au backend
        const reponse = await fetch('http://localhost:4000/auth/login', {
            method: 'POST',
            headers: {
                // étiquette sur l'envoi en format json
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailValue,
                password: passwordValue
            })
        });
        const data = await reponse.json();

        if (reponse.ok) {
            alert("Connexion réussie !");
            window.location.href = "dashboard.html";
        } else {
            alert("Erreur : " + data.message);
        }
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        alert("Impossible de contacter le serveur.");
    }
});