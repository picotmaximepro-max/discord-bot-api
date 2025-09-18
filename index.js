import express from "express";
import { Client, GatewayIntentBits } from "discord.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ Mets ton token de bot dans les variables d'environnement
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = "1371867243977117736"; // Ton serveur

// Initialisation du bot Discord
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// Quand le bot est prêt
client.once("ready", () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

// Endpoint API pour récupérer les salons
app.get("/channels", async (req, res) => {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const channels = await guild.channels.fetch();

    const formatted = channels.map(ch => ({
      id: ch.id,
      name: ch.name,
      type: ch.type
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Erreur API /channels:", error);
    res.status(500).json({ error: "Impossible de récupérer les salons." });
  }
});

// Endpoint API pour récupérer les infos du serveur (ex: membres)
app.get("/stats", async (req, res) => {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const fetched = await guild.fetch();

    res.json({
      id: guild.id,
      name: guild.name,
      approximate_member_count: fetched.approximateMemberCount,
      approximate_presence_count: fetched.approximatePresenceCount
    });
  } catch (error) {
    console.error("Erreur API /stats:", error);
    res.status(500).json({ error: "Impossible de récupérer les stats." });
  }
});

// Lancer le serveur web
app.listen(PORT, () => {
  console.log(`🌍 API disponible sur http://localhost:${PORT}`);
});

// Lancer le bot
client.login(DISCORD_TOKEN);
