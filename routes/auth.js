const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 📌 Route POST /register → créer un utilisateur
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifie si l'email est déjà utilisé
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email déjà utilisé" });

    // Crée un nouvel utilisateur
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 📌 Route POST /login → connexion utilisateur
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifie si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    // Vérifie le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

    // Génère un token JWT
const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });


    res.json({ token, user: { username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;