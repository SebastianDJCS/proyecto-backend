const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
async function connectDB() {
  try {
    // Si hay URI de Atlas, usarla; sino, usar memoria
    const mongoUri = process.env.MONGODB_URI || await startMemoryDB();
    await mongoose.connect(mongoUri);
    console.log('✓ MongoDB conectado');
  } catch (err) {
    console.log('✗ Error MongoDB:', err);
  }
}

async function startMemoryDB() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log('Usando MongoDB en memoria:', uri);
  return uri;
}

connectDB();

// Rutas
app.use('/api/games', require('./routes/games'));
app.use('/api/reviews', require('./routes/reviews'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
