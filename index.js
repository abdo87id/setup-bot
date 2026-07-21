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
const WELCOME_CHANNEL = "1520267388526788712";

client.once("clientReady", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("guildMemberAdd", async (member) => {

  const channel = member.guild.channels.cache.get(WELCOME_CHANNEL);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor("#2F6BFF")
    .setAuthor({
      name: "𝐋𝐈𝐁𝐘𝐀 𝐅𝐎𝐑𝐂𝐄𝐒 𝐑𝐎𝐋𝐁𝐋𝐀𝐘𝐄",
      iconURL: member.guild.iconURL({ dynamic: true })
    })
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
    .setDescription(`
# مرحباً بك في **𝐋𝐈𝐁𝐘𝐀 𝐅𝐎𝐑𝐂𝐄𝐒 𝐑𝐎𝐋𝐁𝐋𝐀𝐘𝐄**  

 منور/ه السيرفر ${member} <a:1076562476444950669:1520857459839991951>

 الرجاء قراءة القوانين لتجنب المخالفات <a:769738405054644276:1520873740076843129>
<#1520267400321171556>

 روم الأخبار موجود فيه كل جديد السيرفر <a:Announcements:1527993365319123037>
<#1520267390129016934>

 عندك أي استفسار؟ توجه إلى التكت <:ViperSemoji:1527858422672920607>
<#1520267501131399238>

 نتمنى لك رحلة موفقة في السيرفر <a:zBlackHearts:1527859498671411443>

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
