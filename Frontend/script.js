// Aider par Gemini
// sélectionner le formulaire dans le HTML
const logFormulaire = document.querySelector('.formLogin');

logFormulaire.addEventListener('submit',async function (evenement) {
    // Empêcher la page de se rafraîchir
    evenement.preventDefault()

    // récupérer ce que l'utilisateur a tapé
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

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

        // Handle FIRST LOGIN (No password set yet)
        if (data.firstLogin) {
            alert("Welcome! Since this is your first time, we are sending an activation link to your email.");
            
            // Trigger the email sending process automatically
            await fetch('http://localhost:4000/auth/request-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            });

            alert("Please check your inbox (and spam) to set up your password. The link expires in 20 minutes.");
            return; 
        }

        // Handle SUCCESSFUL LOGIN
        alert("Login successful! Redirecting...");
        
        // Store user email for the dashboard display
        localStorage.setItem("userEmail", email);
        
        // Go to dashboard
        window.location.href = "../dashboard/dashboard.html";

    } catch (error) {
        console.error("Connection error:", error);
        alert("Unable to contact the server. Please check if your backend is running on port 4000.");
    }
});