const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /users → liste tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Ne renvoie pas les mdp
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /users/:email → récupère un utilisateur par email
router.get('/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /users → créer un utilisateur
router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email déjà utilisé" });

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: "Utilisateur créé", user: { username, email } });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PUT /users/:email → modifier un utilisateur (sauf mdp ici)
router.put('/:email', async (req, res) => {
  try {
    const { username } = req.body;

    const updated = await User.findOneAndUpdate(
      { email: req.params.email },
      { username },
      { new: true }
    ).select('-password');

    if (!updated) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json({ message: "Utilisateur modifié", user: updated });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE /users/:email → supprimer un utilisateur
router.delete('/:email', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
