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
// رتب الأوامر
// ===============================

const ADMIN_ROLE_ID = "1532780829158146048";
const SUPPORT_ROLE_ID = "1532780834468139161";


// ===============================
// التحقق من رتبة الإدارة
// الرتبة المحددة وكل اللي فوقها
// ===============================

function hasAdminRole(member) {

  const role = member.guild.roles.cache.get(ADMIN_ROLE_ID);

  if (!role) return false;

  return member.roles.highest.position >= role.position;
}


// ===============================
// التحقق من رتبة الدعم
// الرتبة المحددة وكل اللي فوقها
// ===============================

function hasSupportRole(member) {

  const role = member.guild.roles.cache.get(SUPPORT_ROLE_ID);

  if (!role) return false;

  return member.roles.highest.position >= role.position;
}


// ===============================
// تحويل الوقت
// 10m = 10 دقائق
// 1h = ساعة
// 2d = يومين
// 1w = أسبوع
// ===============================

function parseDuration(input) {

  if (!input) return null;

  const match = input.toLowerCase().match(/^(\d+)(s|m|h|d|w)$/);

  if (!match) return null;

  const amount = Number(match[1]);
  const unit = match[2];

  const units = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000
  };

  return amount * units[unit];
}


// ===============================
// أوامر الإدارة
// ===============================

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;
  if (!message.guild) return;

  const args = message.content.trim().split(/\s+/);
  const command = args[0].toLowerCase();


  // ===============================
  // قفل
  // ===============================

  if (command === "قفل") {

    if (!hasAdminRole(message.member)) {
      return message.reply("❌ ما عندكش صلاحية.");
    }

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
  // فتح
  // ===============================

  if (command === "فتح") {

    if (!hasAdminRole(message.member)) {
      return message.reply("❌ ما عندكش صلاحية.");
    }

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

    if (!hasAdminRole(message.member)) {
      return message.reply("❌ ما عندكش صلاحية.");
    }

    let amount = parseInt(args[1]);

    if (isNaN(amount)) amount = 100;

    if (amount < 1) amount = 1;
    if (amount > 100) amount = 100;

    try {

      const messages = await message.channel.bulkDelete(
        amount,
        true
      );

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

  if (
    command === "سحب" ||
    command === "تعال"
  ) {

    if (!hasSupportRole(message.member)) {
      return message.reply("❌ ما عندكش صلاحية للسحب.");
    }

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply(
        "❌ لازم تكون داخل روم صوتي أولًا."
      );
    }

    const target = message.mentions.members.first();

    if (!target) {
      return message.reply(
        "❌ منشن الشخص اللي تبي تسحبه."
      );
    }

    if (!message.guild.members.me.permissions.has("MoveMembers")) {
      return message.reply(
        "❌ البوت ما عندهش صلاحية Move Members."
      );
    }

    try {

      await target.voice.setChannel(voiceChannel);

      return message.reply(
        `🔊 تم سحب ${target} إلى **${voiceChannel.name}**.`
      );

    } catch (error) {

      console.log(error);

      return message.reply(
        "❌ ما قدرتش نسحب الشخص."
      );

    }
  }


  // ===============================
  // اسكت / كتم
  // ===============================

  if (
    command === "اسكت" ||
    command === "كتم"
  ) {

    if (!hasAdminRole(message.member)) {
      return message.reply("❌ ما عندكش صلاحية للكتم.");
    }

    const target = message.mentions.members.first();

    if (!target) {
      return message.reply(
        "❌ منشن الشخص اللي تبي تسكته."
      );
    }

    const duration = parseDuration(args[2]);

    if (args[2] && !duration) {
      return message.reply(
        "❌ الوقت غلط. مثال: `10m` أو `1h` أو `2d` أو `1w`."
      );
    }

    if (
      duration &&
      duration > 28 * 24 * 60 * 60 * 1000
    ) {
      return message.reply(
        "❌ أقصى مدة للكتم المؤقت 28 يوم."
      );
    }

    try {

      await target.timeout(
        duration,
        `تم الكتم بواسطة ${message.author.tag}`
      );

      if (duration) {

        return message.reply(
          `🔇 تم كتم ${target} لمدة **${args[2]}**.`
        );

      }

      return message.reply(
        `🔇 تم كتم ${target} حتى يتم فك الكتم.`
      );

    } catch (error) {

      console.log(error);

      return message.reply(
        "❌ ما قدرتش نكتم الشخص. تأكد من صلاحية Moderate Members."
      );

    }
  }


  // ===============================
  // ادوي / فك الكتم
  // ===============================

  if (
    command === "ادوي" ||
    command === "فك"
  ) {

    if (!hasAdminRole(message.member)) {
      return message.reply("❌ ما عندكش صلاحية.");
    }

    const target = message.mentions.members.first();

    if (!target) {
      return message.reply(
        "❌ منشن الشخص اللي تبي تفك عليه الكتم."
      );
    }

    try {

      await target.timeout(null);

      return message.reply(
        `🔊 تم فك الكتم عن ${target}.`
      );

    } catch (error) {

      console.log(error);

      return message.reply(
        "❌ ما قدرتش نفك الكتم."
      );

    }
  }


  // ===============================
  // تف / حضر / لحاس / صبي / حظر
  // ===============================

  if (
    command === "تف" ||
    command === "حضر" ||
    command === "لحاس" ||
    command === "صبي" ||
    command === "حظر"
  ) {

    if (!hasAdminRole(message.member)) {
      return message.reply("❌ ما عندكش صلاحية للحظر.");
    }

    const target = message.mentions.members.first();

    if (!target) {
      return message.reply(
        "❌ منشن الشخص اللي تبي تحظره."
      );
    }

    try {

      await target.ban({
        reason: `تم الحظر بواسطة ${message.author.tag}`
      });

      return message.channel.send(
        `🔨 تم حظر **${target.user.tag}** من السيرفر.`
      );

    } catch (error) {

      console.log(error);

      return message.reply(
        "❌ ما قدرتش نحظر الشخص. تأكد من صلاحية Ban Members."
      );

    }
  }

});
client.login(TOKEN);
