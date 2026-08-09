const {
  Client,
  GatewayIntentBits,
  EmbedBuilder
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildVoiceStates
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

// ===============================
// نظام التكت
// ===============================

client.on("channelCreate", async (channel) => {

  if (!channel.guild) return;
  if (!channel.isTextBased()) return;

  // التحقق من أن اسم الروم يبدأ بإيموجي التكت
  if (!channel.name.startsWith("🎫")) return;

  // ننتظر 3 ثواني حتى يكمل Wick إنشاء التكت
  setTimeout(async () => {

    try {

      await channel.send(`
🎫 **مرحبا بك في التكت**

📋 اكتب طلبك أو استفسارك بالتفصيل، وانتظر أحد أعضاء الإدارة للرد عليك.

⚠️ الرجاء عدم إرسال رسائل متكررة أو عمل منشن للإدارة.

❤️ نتمنى لك تجربة موفقة في **𝐀𝐓𝐋𝐀𝐍𝐓𝐈𝐒 𝐂𝐈𝐓𝐘 𝐂𝐅𝐖**
`);

    } catch (error) {
      console.log("❌ لم أستطع إرسال رسالة التكت:", error);
    }

  }, 3000);
});

// ===============================
// نظام @everyone
// ===============================

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (!message.mentions.everyone) return;

  try {
    await message.channel.send({
      files: [
        {
          attachment: "./standard.gif",
          name: "standard.gif"
        }
      ]
    });

  } catch (error) {
    console.log("❌ خطأ في إرسال GIF:");
    console.log(error);
  }
});
// ===============================
// أوامر الإدارة
// ===============================

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  // الإدارة فقط
  if (!message.member.permissions.has("Administrator")) return;

  const args = message.content.trim().split(/\s+/);
  const command = args[0].toLowerCase();

  // ===============================
  // قفل الشات
  // ===============================

  if (command === "قفل") {
    try {
      await message.channel.permissionOverwrites.edit(
        message.guild.roles.everyone,
        {
          SendMessages: false
        }
      );

      return message.channel.send("🔒 تم قفل الشات.");
    } catch (error) {
      console.log(error);
      return message.reply("❌ ما قدرتش نقفل الشات.");
    }
  }

  // ===============================
  // فتح الشات
  // ===============================

  if (command === "فتح") {
    try {
      await message.channel.permissionOverwrites.edit(
        message.guild.roles.everyone,
        {
          SendMessages: null
        }
      );

      return message.channel.send("🔓 تم فتح الشات.");
    } catch (error) {
      console.log(error);
      return message.reply("❌ ما قدرتش نفتح الشات.");
    }
  }

  // ===============================
  // مسح / تنظيف / حذف
  // ===============================

  if (
    command === "مسح" ||
    command === "تنظيف" ||
    command === "حذف"
  ) {
    let amount = parseInt(args[1]);

    if (isNaN(amount)) amount = 100;

    if (amount < 1) amount = 1;
    if (amount > 100) amount = 100;

    try {
      const messages = await message.channel.bulkDelete(amount, true);

      const msg = await message.channel.send(
        `🧹 تم حذف **${messages.size}** رسالة.`
      );

      setTimeout(() => {
        msg.delete().catch(() => {});
      }, 3000);

    } catch (error) {
      console.log(error);
      return message.reply("❌ ما قدرتش نمسح الرسائل.");
    }
  }

  // ===============================
  // سحب / تعال
  // ===============================

  if (command === "سحب" || command === "تعال") {

    // لازم تكون داخل روم صوتي
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply(
        "❌ لازم تكون داخل روم صوتي باش تسحب الشخص."
      );
    }

    // الشخص اللي تم منشنه
    const target = message.mentions.members.first();

    if (!target) {
      return message.reply(
        "❌ منشن الشخص اللي تبي تسحبه."
      );
    }

    // التأكد من صلاحية البوت
    if (
      !message.guild.members.me.permissions.has("MoveMembers")
    ) {
      return message.reply(
        "❌ البوت ما عندهش صلاحية **Move Members**."
      );
    }

    try {

      await target.voice.setChannel(voiceChannel);

      return message.reply(
        `🔊 تم سحب ${target} إلى **${voiceChannel.name}**.`
      );

    } catch (error) {

      console.log("❌ خطأ في السحب:", error);

      return message.reply(
        "❌ ما قدرتش نسحب الشخص. تأكد من صلاحيات البوت وأن رتبته أعلى من رتبة الشخص."
      );
    }
  }
});
client.login(TOKEN);
