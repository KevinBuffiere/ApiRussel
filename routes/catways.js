const express = require('express');
const router = express.Router();
const Catway = require('../models/Catway');

// GET /catways → liste tous les catways
router.get('/', async (req, res) => {
  try {
    const catways = await Catway.find();
    res.json(catways);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /catways/:id → un catway spécifique
router.get('/:id', async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) return res.status(404).json({ message: "Introuvable" });
    res.json(catway);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /catways → créer un catway
router.post('/', async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;
    const newCatway = new Catway({ catwayNumber, catwayType, catwayState });
    await newCatway.save();
    res.status(201).json({ message: "Catway créé", catway: newCatway });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// PUT /catways/:id → modifier l’état (seulement catwayState)
router.put('/:id', async (req, res) => {
  try {
    const catway = await Catway.findOneAndUpdate(
      { catwayNumber: req.params.id },
      { catwayState: req.body.catwayState },
      { new: true }
    );
    if (!catway) return res.status(404).json({ message: "Introuvable" });
    res.json({ message: "Catway mis à jour", catway });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE /catways/:id → supprimer un catway
router.delete('/:id', async (req, res) => {
  try {
    const catway = await Catway.findOneAndDelete({ catwayNumber: req.params.id });
    if (!catway) return res.status(404).json({ message: "Introuvable" });
    res.json({ message: "Catway supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
