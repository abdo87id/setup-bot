const {
  Client,
  GatewayIntentBits,
  EmbedBuilder
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// ضع توكن البوت هنا
const TOKEN = process.env.TOKEN;

// روم الترحيب
const WELCOME_CHANNEL = "1532781166468272311";

client.once("clientReady", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("guildMemberAdd", async (member) => {

  const channel = member.guild.channels.cache.get(WELCOME_CHANNEL);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor("#2F6BFF")
    .setAuthor({
      name: "𝐀𝐓𝐋𝐀𝐍𝐓𝐈𝐒 𝐂𝐈𝐓𝐘 𝐂𝐅𝐖",
      iconURL: member.guild.iconURL({ dynamic: true })
    })
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
    .setDescription(`
# مرحباً بك في **𝐀𝐓𝐋𝐀𝐍𝐓𝐈𝐒 𝐂𝐈𝐓𝐘 𝐂𝐅𝐖**  

 منور/ه السيرفر ${member} <a:1076562476444950669:1520857459839991951>

 الرجاء قراءة القوانين لتجنب المخالفات <a:769738405054644276:1520873740076843129>
<#1532781203533598771>

 روم الأخبار موجود فيه كل جديد السيرفر <a:Announcements:1534640407374463007>
<#1532781186236153906>

 عندك أي استفسار؟ توجه إلى التكت <:ViperSemoji:1534639284768870691>
<#1532781401689293030>

 نتمنى لك رحلة موفقة في السيرفر <a:1226_discord_verified:1534639614940151928> 

━━━━━━━━━━━━━━━━━━

**Username**
${member.user.tag}

**User ID**
${member.id}

**أنت العضو رقم**
${member.guild.memberCount}
`)
    .setImage(member.guild.iconURL({ dynamic: true, size: 1024 }))
    .setTimestamp();

  channel.send({
    embeds: [embed]
  });

});

client.login(TOKEN);
