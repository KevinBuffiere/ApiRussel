const mongoose = require('mongoose'); 
// Importe mongoose pour pouvoir créer un schéma de données

const catwaySchema = new mongoose.Schema({
  // Déclare le schéma de la collection "catways"

  catwayNumber: {
    type: Number,        // doit être un nombre
    required: true,      // obligatoire
    unique: true         // pas de doublons (numéros uniques)
  },

  catwayType: {
    type: String, 
    required: true,
    enum: ['long', 'short'] // ne peut être que "long" ou "short"
  },

  catwayState: {
    type: String, 
    required: true       // description obligatoire (ex : bon état, cassé...)
  }

}, { timestamps: true }); 
// Ajoute automatiquement "createdAt" et "updatedAt"

module.exports = mongoose.model('Catway', catwaySchema); 
// Exporte le modèle pour l’utiliser dans les routes
