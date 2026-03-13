import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    // 1. Récupérer le header "Authorization"
    const authHeader = req.headers['authorization'];
    // Le format est souvent "Bearer TOKEN", donc on split pour avoir juste le TOKEN
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Accès refusé. Token manquant." });
    }

    // 2. Vérifier si le token est valide avec ta clé secrète
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token invalide ou expiré." });
        }

        // 3. Succès ! On injecte les infos de l'utilisateur dans la requête
        req.user = user;

        // 4. On passe à la suite (la route DELETE)
        next();
    });
};

export {authenticateToken };