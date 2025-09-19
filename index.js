import express from 'express';
import { Client, GatewayIntentBits } from 'discord.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Active CORS pour toutes les origines
app.use(cors());

// Créer le client Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

// Quand le bot est prêt
client.once('ready', () => {
    console.log(`Bot connecté en tant que ${client.user.tag}`);
});

// Route API pour obtenir les stats du serveur
app.get('/stats', async (req, res) => {
    try {
        const guild = await client.guilds.fetch('1371867243977117736'); // Ton ID de serveur
        res.json({
            id: guild.id,
            name: guild.name,
            approximate_member_count: guild.memberCount,
            approximate_presence_count: guild.members.cache.filter(member => member.presence?.status === 'online').size
        });
    } catch (err) {
        console.error('Erreur lors de la récupération des stats:', err);
        res.status(500).send('Erreur lors de la récupération des stats');
    }
});

// Route API pour récupérer la liste des salons
app.get('/channels', async (req, res) => {
    try {
        const guild = await client.guilds.fetch('1371867243977117736'); // Ton ID de serveur
        const channels = await guild.channels.fetch();
        const formatted = channels.map(ch => ({
            id: ch.id,
            name: ch.name,
            type: ch.type
        }));
        res.json(formatted);
    } catch (err) {
        console.error('Erreur lors de la récupération des salons:', err);
        res.status(500).send('Erreur lors de la récupération des salons');
    }
});

// Lancer le serveur Express
app.listen(PORT, () => {
    console.log(`Serveur API lancé sur le port ${PORT}`);
});

// Connecter le bot Discord avec le token
client.login(process.env.DISCORD_TOKEN);  // Utilisation du token stocké dans les variables d'environnement
