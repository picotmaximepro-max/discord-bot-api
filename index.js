import { Client, GatewayIntentBits } from 'discord.js';
import express from 'express';

const app = express();
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates]
});

client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
});

app.get('/channels', async (req, res) => {
    const guild = await client.guilds.fetch('1371867243977117736'); // L'ID de ton serveur

    try {
        const channels = await guild.channels.fetch();
        const formatted = channels.map(ch => ({
            id: ch.id,
            name: ch.name,
            type: ch.type
        }));
        res.json(formatted); // Retourne la liste des salons
    } catch (err) {
        res.status(500).send("Erreur lors de la récupération des salons.");
    }
});

client.login('TON_TOKEN');
app.listen(3000, () => console.log('API en ligne.'));
