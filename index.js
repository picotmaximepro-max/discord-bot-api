const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Active CORS pour toutes les origines
app.use(cors());

// Créer le client Discord
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates]
});

// Quand le bot est prêt
client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
});

// Route API pour les stats du serveur
app.get('/stats', async (req, res) => {
    try {
        const guild = await client.guilds.fetch('1371867243977117736'); // ID de ton serveur Discord
        res.json({
            id: guild.id,
            name: guild.name,
            approximate_member_count: guild.memberCount,  // Le nombre total de membres
            approximate_presence_count: guild.members.cache.filter(member => member.presence?.status === 'online').size // Membres connectés
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des stats');
    }
});

// Route API pour récupérer la liste des salons
app.get('/channels', async (req, res) => {
    try {
        const guild = await client.guilds.fetch('1371867243977117736'); // ID de ton serveur Discord
        const channels = await guild.channels.fetch();
        const formatted = channels.map(ch => ({
            id: ch.id,
            name: ch.name,
            type: ch.type
        }));
        res.json(formatted);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des salons');
    }
});

// Démarrer le serveur Express
app.listen(PORT, () => {
    console.log(`API en ligne sur le port ${PORT}`);
});

// Lancer le bot Discord
client.login('TON_TOKEN');  // N'oublie pas de remplacer TON_TOKEN par ton véritable token de bot
