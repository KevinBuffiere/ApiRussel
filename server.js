const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const reservationRoutes = require('./routes/reservations');
app.use('/api/reservations', reservationRoutes);

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const catwayRoutes = require('./routes/catways');
app.use('/api/catways', catwayRoutes);


mongoose.connect(process.env.MONGO_URI)

.then(() => {
  console.log("✅ MongoDB connecté");
  app.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT}`));
})
.catch(err => console.error("❌ Erreur MongoDB :", err));
