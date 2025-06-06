const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

// GET /reservations → liste toutes les réservations
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /reservations/:id → détails d'une réservation
router.get('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Introuvable" });
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /reservations → créer une réservation
router.post('/', async (req, res) => {
  try {
    const { catwayNumber, clientName, boatName, startDate, endDate } = req.body;

    const newReservation = new Reservation({ catwayNumber, clientName, boatName, startDate, endDate });
    await newReservation.save();

    res.status(201).json({ message: "Réservation créée", reservation: newReservation });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// PUT /reservations/:id → modifier une réservation
router.put('/:id', async (req, res) => {
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedReservation) return res.status(404).json({ message: "Introuvable" });
    res.json({ message: "Réservation mise à jour", reservation: updatedReservation });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE /reservations/:id → supprimer une réservation
router.delete('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Introuvable" });
    res.json({ message: "Réservation supprimée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
