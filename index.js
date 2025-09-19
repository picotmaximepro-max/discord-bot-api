import express from "express";
import cors from "cors";
import { Client, GatewayIntentBits, ChannelType } from "discord.js";

const app = express();
const PORT = process.env.PORT || 3000;
const GUILD_ID = "1371867243977117736"; // Ton serveur

app.use(cors());

// Client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ]
});

client.once("ready", () => {
  console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
});

// Route API /stats
app.get("/stats", async (req, res) => {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    await guild.members.fetch();
    const channels = await guild.channels.fetch();

    const totalMembers = guild.memberCount;
    const onlineMembers = guild.members.cache.filter(
      m => m.presence?.status === "online" || m.presence?.status === "dnd" || m.presence?.status === "idle"
    ).size;

    const textChannels = channels.filter(ch => ch.type === ChannelType.GuildText).size;
    const voiceChannels = channels.filter(ch => ch.type === ChannelType.GuildVoice).size;

    res.json({
      guild_id: guild.id,
      guild_name: guild.name,
      total_members: totalMembers,
      online_members: onlineMembers,
      text_channels: textChannels,
      voice_channels: voiceChannels
    });
  } catch (err) {
    console.error("Erreur stats:", err);
    res.status(500).send("Impossible de récupérer les stats");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API lancée sur le port ${PORT}`);
});

client.login(process.env.DISCORD_TOKEN);
