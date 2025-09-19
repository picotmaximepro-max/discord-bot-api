import express from "express";
import cors from "cors";
import { Client, GatewayIntentBits } from "discord.js";

const app = express();
const PORT = process.env.PORT || 3000;
const GUILD_ID = "1371867243977117736"; // Remplace par l'ID de ton serveur

// Middleware
app.use(cors());

// Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,   // ← nécessaire pour compter les membres
    GatewayIntentBits.GuildPresences  // ← nécessaire pour voir qui est en ligne
  ]
});

// Quand le bot est prêt
client.once("ready", () => {
  console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
});

// Route API : /stats
app.get("/stats", async (req, res) => {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    await guild.members.fetch(); // charge le cache des membres

    const totalMembers = guild.memberCount;
    const onlineMembers = guild.members.cache.filter(
      m => m.presence?.status === "online" || m.presence?.status === "dnd" || m.presence?.status === "idle"
    ).size;

    res.json({
      guild_id: guild.id,
      guild_name: guild.name,
      total_members: totalMembers,
      online_members: onlineMembers
    });
  } catch (err) {
    console.error("Erreur stats:", err);
    res.status(500).send("Impossible de récupérer les stats");
  }
});

// Lancer serveur web
app.listen(PORT, () => {
  console.log(`🚀 API lancée sur le port ${PORT}`);
});

// Connecter le bot
client.login(process.env.DISCORD_TOKEN);
