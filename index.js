// index.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Active CORS pour toutes les origines
app.use(cors());

// (Optionnel) Si tu veux limiter à ton site uniquement :
// app.use(cors({ origin: 'https://ton-site.com' }));

app.use(express.json());

// Route qui renvoie les stats du serveur
app.get('/stats', (req, res) => {
  // Ici tu mettras ton vrai code qui récupère les infos de Discord
  res.json({
    id: "1371867243977117736",
    name: "ᵐᵃʳˣˢʸˡˡ",
    approximate_member_count: 14,
    approximate_presence_count: 10
  });
});

// Route qui renvoie la liste des salons (exemple vide)
app.get('/channels', (req, res) => {
  // Ici tu mettras ton vrai code pour lister les salons
  res.json([]);
});

// Pour gérer les requêtes OPTIONS (préflight CORS)
app.options('*', cors());

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`✅ API Discord bot lancée sur le port ${PORT}`);
});
