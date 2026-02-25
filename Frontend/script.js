// Aider par Gemini
// sélectionner le formulaire dans le HTML
const logFormulaire = document.querySelector('.formLogin');

logFormulaire.addEventListener('submit',async function (evenement) {
    // Empêcher la page de se rafraîchir
    evenement.preventDefault()

    // récupérer ce que l'utilisateur a tapé
    const email = document.getElementById('exampleInputEmail1').value;
    const password = document.getElementById('exampleInputPassword1').value;

    try {
        // envoie des données au backend
        const reponse = await fetch('http://localhost:4000/auth/login', {
            method: 'POST',
            headers: {
                // étiquette sur l'envoi en format json
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        const data = await reponse.json();

        if (!reponse.ok) {
            alert("Erreur : " + data.message);
            return;
        }

        if (data.firstLogin){
            localStorage.setItem("firstLoginEmail", email);
            alert(data.message);
            window.location.href = "../create-password/create-password.html";
            return
        }
        alert("Connexion réussie !");
        window.location.href = "../dashboard/dashboard.html";
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        alert("Impossible de contacter le serveur.");
    }
});