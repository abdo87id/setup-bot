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

// ==========================================
// 🔑 توكن البوت
// ==========================================

const TOKEN = process.env.TOKEN;

// ==========================================
// 👋 روم الترحيب
// ==========================================

const WELCOME_CHANNEL = "1532781166468272311";

// ==========================================
// 🎫 إعدادات التكت
// ==========================================

const TICKET_PREFIX = "🎫・";

// ==========================================
// 🛡️ الرتب
// ==========================================

const ADMIN_ROLE_ID = "1532780829158146048";
const SUPPORT_ROLE_ID = "1532780834468139161";
const PROTECTED_ROLE_ID = "1532780825534402771";

// ==========================================
// 🚀 تشغيل البوت
// ==========================================

client.once("clientReady", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// ==========================================
// 👋 نظام الترحيب
// ==========================================

client.on("guildMemberAdd", async (member) => {

  const channel = member.guild.channels.cache.get(WELCOME_CHANNEL);

  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor("#2F6BFF")
    .setAuthor({
      name: "𝐀𝐓𝐋𝐀𝐍𝐓𝐈𝐒 𝐂𝐈𝐓𝐘 𝐂𝐅𝐖",
      iconURL: member.guild.iconURL({ dynamic: true })
    })
    .setThumbnail(
      member.user.displayAvatarURL({
        dynamic: true,
        size: 1024
      })
    )
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
    .setImage(
      member.guild.iconURL({
        dynamic: true,
        size: 1024
      })
    )
    .setTimestamp();

  await channel.send({
    embeds: [embed]
  }).catch(() => {});
});

// ==========================================
// 🎫 رسالة التكت عند إنشاء الروم
// ==========================================

client.on("channelCreate", async (channel) => {

  if (!channel.guild) return;
  if (!channel.isTextBased()) return;
  if (!channel.name.startsWith("🎫")) return;

  setTimeout(async () => {

    try {

      await channel.send(`
🎫 **مرحبا بك في التكت**

📋 اكتب طلبك أو استفسارك بالتفصيل، وانتظر أحد أعضاء الإدارة للرد عليك.

⚠️ الرجاء عدم إرسال رسائل متكررة أو عمل منشن للإدارة.

❤️ نتمنى لك تجربة موفقة في **𝐀𝐓𝐋𝐀𝐍𝐓𝐈𝐒 𝐂𝐈𝐓𝐘 𝐂𝐅𝐖**
`);

    } catch (error) {

      console.log(
        "❌ لم أستطع إرسال رسالة التكت:",
        error
      );

    }

  }, 3000);
});

console.log("👋 Welcome System Loaded");
console.log("🎫 Ticket Welcome System Loaded");
// ==========================================
// 👮‍♂️ الجزء 2 — أوامر الإدارة
// ==========================================

// ==========================================
// 🔐 التحقق من رتبة الإدارة
// ==========================================

function hasAdminRole(member) {

  if (!member || !member.guild) return false;

  const role = member.guild.roles.cache.get(ADMIN_ROLE_ID);

  if (!role) return false;

  return member.roles.highest.position >= role.position;
}

// ==========================================
// 🎫 التحقق من رتبة الدعم
// ==========================================

function hasSupportRole(member) {

  if (!member || !member.guild) return false;

  const role = member.guild.roles.cache.get(SUPPORT_ROLE_ID);

  if (!role) return false;

  return member.roles.highest.position >= role.position;
}

// ==========================================
// 🛡️ الرتبة المحمية
// الرتبة نفسها وكل الرتب الأعلى منها
// ==========================================

function isProtected(member) {

  if (!member || !member.guild) return false;

  const protectedRole =
    member.guild.roles.cache.get(PROTECTED_ROLE_ID);

  if (!protectedRole) return false;

  return member.roles.highest.position >= protectedRole.position;
}

// ==========================================
// ⏱️ تحويل الوقت
// 10m / 1h / 2d / 1w
// ==========================================

function parseDuration(input) {

  if (!input) return null;

  const match =
    input.toLowerCase().match(/^(\d+)(s|m|h|d|w)$/);

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

// ==========================================
// 📋 أوامر الإدارة
// ==========================================

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;
  if (!message.guild) return;

  const args =
    message.content.trim().split(/\s+/);

  const command =
    args[0].toLowerCase();

  // ==========================================
  // 🔒 قفل
  // ==========================================

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

      return message.channel.send(
        "🔒 تم قفل الشات."
      );

    } catch (error) {

      console.log(error);

      return message.reply(
        "❌ ما قدرتش نقفل الشات."
      );
    }
  }

  // ==========================================
  // 🔓 فتح
  // ==========================================

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

      return message.channel.send(
        "🔓 تم فتح الشات."
      );

    } catch (error) {

      console.log(error);

      return message.reply(
        "❌ ما قدرتش نفتح الشات."
      );
    }
  }

  // ==========================================
  // 🧹 مسح / تنظيف / حذف
  // ==========================================

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

      const messages =
        await message.channel.bulkDelete(
          amount,
          true
        );

      const msg =
        await message.channel.send(
          `🧹 تم حذف **${messages.size}** رسالة.`
        );

      setTimeout(() => {
        msg.delete().catch(() => {});
      }, 3000);

    } catch (error) {

      console.log(error);

      return message.reply(
        "❌ ما قدرتش نمسح الرسائل."
      );
    }
  }

  // ==========================================
  // 🔊 سحب / تعال
  // ==========================================

  if (
    command === "سحب" ||
    command === "تعال"
  ) {

    if (!hasSupportRole(message.member)) {
      return message.reply(
        "❌ ما عندكش صلاحية للسحب."
      );
    }

    const voiceChannel =
      message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply(
        "❌ لازم تكون داخل روم صوتي أولًا."
      );
    }

    const target =
      message.mentions.members.first();

    if (!target) {
      return message.reply(
        "❌ منشن الشخص اللي تبي تسحبه."
      );
    }

    if (
      !message.guild.members.me.permissions
        .has("MoveMembers")
    ) {
      return message.reply(
        "❌ البوت ما عندهش صلاحية Move Members."
      );
    }

    try {

      await target.voice.setChannel(
        voiceChannel
      );

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

  // ==========================================
  // 🔇 اسكت / كتم
  // ==========================================

  if (
    command === "اسكت" ||
    command === "كتم"
  ) {

    if (!hasAdminRole(message.member)) {
      return message.reply(
        "❌ ما عندكش صلاحية للكتم."
      );
    }

    const target =
      message.mentions.members.first();

    if (!target) {
      return message.reply(
        "❌ منشن الشخص اللي تبي تسكته."
      );
    }

    const duration =
      parseDuration(args[2]);

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

  // ==========================================
  // 🔊 ادوي / فك
  // ==========================================

  if (
    command === "ادوي" ||
    command === "فك"
  ) {

    if (!hasAdminRole(message.member)) {
      return message.reply(
        "❌ ما عندكش صلاحية."
      );
    }

    const target =
      message.mentions.members.first();

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

  // ==========================================
  // 🔨 حظر
  // ==========================================

  if (
    command === "تف" ||
    command === "حضر" ||
    command === "لحاس" ||
    command === "صبي" ||
    command === "حظر"
  ) {

    if (!hasAdminRole(message.member)) {
      return message.reply(
        "❌ ما عندكش صلاحية للحظر."
      );
    }

    const target =
      message.mentions.members.first();

    if (!target) {
      return message.reply(
        "❌ منشن الشخص اللي تبي تحظره."
      );
    }

    try {

      await target.ban({
        reason:
          `تم الحظر بواسطة ${message.author.tag}`
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

console.log("👮‍♂️ Admin Commands Loaded");
// ==========================================
// 🛡️ الجزء 3 — AUTO MOD والحماية
// ==========================================

// ==========================================
// 📊 تتبع المنشنات
// ==========================================

const mentionTracker = new Map();

// ==========================================
// 🔗 روابط Discord
// ==========================================

const discordInviteRegex =
  /(https?:\/\/)?(www\.)?(discord\.gg|discord\.com\/invite|discordapp\.com\/invite)\/[a-zA-Z0-9-]+/gi;

// ==========================================
// 🔗 جميع الروابط
// ==========================================

const anyLinkRegex =
  /(https?:\/\/|www\.)[^\s]+/gi;

// ==========================================
// 🔁 تتبع الرسائل المتكررة
// ==========================================

const repeatedMessages = new Map();

// ==========================================
// 📢 AUTO MOD
// ==========================================

client.on("messageCreate", async (message) => {

  try {

    if (!message.guild || message.author.bot) return;

    const member = message.member;

    // الرتب المحمية مستثناة من الحماية
    if (isProtected(member)) return;

    // ==========================================
    // 📢 @everyone / @here
    // ==========================================

    if (message.mentions.everyone) {

      await message.channel.send({
        files: [
          {
            attachment: "./standard.gif",
            name: "standard.gif"
          }
        ]
      }).catch(() => {});

      return;
    }

    // ==========================================
    // 🔗 منع روابط Discord
    // ==========================================

    if (discordInviteRegex.test(message.content)) {

      await message.delete().catch(() => {});

      // Timeout لمدة ساعة
      if (member.moderatable) {

        await member.timeout(
          60 * 60 * 1000,
          "إرسال رابط سيرفر Discord ممنوع"
        ).catch(() => {});

      }

      // تنبيه في الخاص
      await member.send({
        content:
          `⚠️ **تنبيه من سيرفر ${message.guild.name}**\n\n` +
          `تم منعك من إرسال روابط سيرفرات Discord.\n` +
          `تم إعطاؤك **Timeout لمدة ساعة** بسبب إرسال رابط Discord.`
      }).catch(() => {});

      return;
    }

    // ==========================================
    // 🔗 منع جميع الروابط
    // ==========================================

    if (anyLinkRegex.test(message.content)) {

      await message.delete().catch(() => {});

      await member.send({
        content:
          `⚠️ **تنبيه من سيرفر ${message.guild.name}**\n\n` +
          `الروابط ممنوعة في هذا السيرفر.`
      }).catch(() => {});

      return;
    }

    // ==========================================
    // 📢 Anti Mention Spam
    // 3 رسائل فيها منشن خلال 4 ثواني
    // ==========================================

    const mentionCount =
      message.mentions.users.size;

    if (mentionCount > 0) {

      const userId = message.author.id;
      const now = Date.now();

      if (!mentionTracker.has(userId)) {
        mentionTracker.set(userId, []);
      }

      const timestamps =
        mentionTracker.get(userId);

      const recent =
        timestamps.filter(
          time => now - time <= 4000
        );

      recent.push(now);

      mentionTracker.set(
        userId,
        recent
      );

      // 3 رسائل منشن خلال 4 ثواني
      if (recent.length >= 3) {

        mentionTracker.delete(userId);

        await message.delete().catch(() => {});

        // Timeout 10 دقائق
        if (member.moderatable) {

          await member.timeout(
            10 * 60 * 1000,
            "Spam mentions - 3 mentions within 4 seconds"
          ).catch(() => {});

        }

        await member.send({
          content:
            `⚠️ **تنبيه من سيرفر ${message.guild.name}**\n\n` +
            `تم رصد استخدام المنشن بشكل مزعج.\n` +
            `بسبب تكرار المنشن **3 مرات خلال 4 ثواني**، ` +
            `تم إعطاؤك **Timeout لمدة 10 دقائق**.`
        }).catch(() => {});

        return;
      }
    }

    // ==========================================
    // 🔁 منع تكرار نفس الرسالة
    // ==========================================

    const content =
      message.content.trim().toLowerCase();

    if (content) {

      const userId = message.author.id;

      if (!repeatedMessages.has(userId)) {

        repeatedMessages.set(userId, {
          content: content,
          count: 1,
          lastMessage: Date.now()
        });

      } else {

        const data =
          repeatedMessages.get(userId);

        const now = Date.now();

        // إذا نفس الرسالة خلال 10 ثواني
        if (
          data.content === content &&
          now - data.lastMessage <= 10000
        ) {

          data.count++;
          data.lastMessage = now;

          // 4 مرات
          if (data.count >= 4) {

            repeatedMessages.delete(userId);

            await message.delete().catch(() => {});

            if (member.moderatable) {

              await member.timeout(
                5 * 60 * 1000,
                "Repeated messages spam"
              ).catch(() => {});

            }

            await member.send({
              content:
                `⚠️ **تنبيه من سيرفر ${message.guild.name}**\n\n` +
                `تم رصد تكرار نفس الرسالة بشكل مزعج.\n` +
                `تم إعطاؤك **Timeout لمدة 5 دقائق**.`
            }).catch(() => {});

            return;
          }

        } else {

          repeatedMessages.set(userId, {
            content: content,
            count: 1,
            lastMessage: now
          });

        }
      }
    }

  } catch (error) {

    console.error(
      "❌ AutoMod Error:",
      error
    );

  }

});

// ==========================================
// 🧹 تنظيف بيانات المنشن
// ==========================================

setInterval(() => {

  const now = Date.now();

  for (
    const [userId, timestamps]
    of mentionTracker.entries()
  ) {

    const recent =
      timestamps.filter(
        time => now - time <= 4000
      );

    if (recent.length === 0) {

      mentionTracker.delete(userId);

    } else {

      mentionTracker.set(
        userId,
        recent
      );

    }
  }

}, 60 * 1000);

// ==========================================
// 🧹 تنظيف بيانات الرسائل المتكررة
// ==========================================

setInterval(() => {

  const now = Date.now();

  for (
    const [userId, data]
    of repeatedMessages.entries()
  ) {

    if (now - data.lastMessage > 10000) {
      repeatedMessages.delete(userId);
    }

  }

}, 60 * 1000);

console.log("🛡️ AutoMod System Loaded");
console.log("🔗 Link Protection Loaded");
console.log("📢 Mention Protection Loaded");
console.log("🔁 Anti Spam Loaded");
// ==========================================
// 🎫 الجزء 4 — نظام التكت كامل
// ==========================================

// ==========================================
// 📌 التحقق من أن الروم تكت
// ==========================================

function isTicketChannel(channel) {
  return (
    channel &&
    channel.isTextBased() &&
    channel.name.startsWith(TICKET_PREFIX)
  );
}

// ==========================================
// 👤 الحصول على صاحب التكت
// ==========================================

async function getTicketOwner(channel) {

  try {

    // البحث في صلاحيات الروم
    for (
      const overwrite
      of channel.permissionOverwrites.cache.values()
    ) {

      if (overwrite.type !== 1) continue;

      if (!overwrite.allow.has("ViewChannel")) continue;

      const member =
        await channel.guild.members
          .fetch(overwrite.id)
          .catch(() => null);

      if (!member) continue;

      if (member.user.bot) continue;

      if (hasAdminRole(member)) continue;

      if (hasSupportRole(member)) continue;

      return member;
    }

    // محاولة البحث في رسائل Wick
    const messages =
      await channel.messages.fetch({
        limit: 50
      }).catch(() => null);

    if (messages) {

      for (const msg of messages.values()) {

        for (const embed of msg.embeds) {

          if (!embed.fields) continue;

          for (const field of embed.fields) {

            if (
              field.name &&
              field.name.includes("مالك التذكرة")
            ) {

              const match =
                field.value.match(
                  /<@!?(\d{17,20})>/
                );

              if (match) {

                return await channel.guild.members
                  .fetch(match[1])
                  .catch(() => null);

              }
            }
          }
        }
      }
    }

    return null;

  } catch (error) {

    console.error(
      "❌ Ticket Owner Error:",
      error
    );

    return null;
  }
}

// ==========================================
// 🎫 +come
// ==========================================

client.on("messageCreate", async (message) => {

  try {

    if (!message.guild || message.author.bot) return;

    const command =
      message.content.trim().toLowerCase();

    if (command !== "+come") return;

    const channel = message.channel;

    if (!isTicketChannel(channel)) {

      return message.reply(
        "❌ الأمر هذا يشتغل داخل التكتات فقط."
      );

    }

    if (
      !message.member.permissions.has(
        "ManageChannels"
      )
    ) {

      return message.reply(
        "❌ ما عندكش صلاحية تستعمل الأمر هذا."
      );

    }

    const owner =
      await getTicketOwner(channel);

    if (!owner) {

      return message.reply(
        "❌ ما قدرتش نحدد صاحب التكت."
      );

    }

    await channel.send({
      content:
        `📢 **${owner}**\n` +
        `الدعم محتاج ردك في التكت، يرجى الرجوع للتكت.`
    });

    await owner.send({
      content:
        `📢 **تنبيه من سيرفر ${message.guild.name}**\n\n` +
        `الدعم محتاج ردك في التكت:\n` +
        `${channel}`
    }).catch(() => {});

  } catch (error) {

    console.error(
      "❌ +come Error:",
      error
    );

  }

});

// ==========================================
// 🎫 +claim
// ==========================================

client.on("messageCreate", async (message) => {

  try {

    if (!message.guild || message.author.bot) return;

    if (
      message.content.trim().toLowerCase() !==
      "+claim"
    ) return;

    const channel = message.channel;

    if (!isTicketChannel(channel)) {

      return message.reply(
        "❌ الأمر هذا يشتغل داخل التكتات فقط."
      );

    }

    if (!hasSupportRole(message.member)) {

      return message.reply(
        "❌ ما عندكش صلاحية تستعمل الأمر هذا."
      );

    }

    await channel.send(
      `🎫 **تم استلام التكت**\n\n` +
      `👤 المسؤول: ${message.author}\n` +
      `📌 سيتم متابعة طلبك من قبلي.`
    );

  } catch (error) {

    console.error(
      "❌ +claim Error:",
      error
    );

  }

});

// ==========================================
// 🎫 +add @user
// ==========================================

client.on("messageCreate", async (message) => {

  try {

    if (!message.guild || message.author.bot) return;

    const args =
      message.content.trim().split(/\s+/);

    if (
      args[0].toLowerCase() !== "+add"
    ) return;

    const channel = message.channel;

    if (!isTicketChannel(channel)) {

      return message.reply(
        "❌ الأمر هذا يشتغل داخل التكتات فقط."
      );

    }

    if (!hasSupportRole(message.member)) {

      return message.reply(
        "❌ ما عندكش صلاحية تستعمل الأمر هذا."
      );

    }

    const target =
      message.mentions.members.first();

    if (!target) {

      return message.reply(
        "❌ منشن الشخص اللي تبي تضيفه."
      );

    }

    await channel.permissionOverwrites.edit(
      target.id,
      {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true
      }
    );

    await channel.send(
      `✅ تم إضافة ${target} إلى التكت بواسطة ${message.author}.`
    );

  } catch (error) {

    console.error(
      "❌ +add Error:",
      error
    );

  }

});

// ==========================================
// 🎫 +remove @user
// ==========================================

client.on("messageCreate", async (message) => {

  try {

    if (!message.guild || message.author.bot) return;

    const args =
      message.content.trim().split(/\s+/);

    if (
      args[0].toLowerCase() !== "+remove"
    ) return;

    const channel = message.channel;

    if (!isTicketChannel(channel)) {

      return message.reply(
        "❌ الأمر هذا يشتغل داخل التكتات فقط."
      );

    }

    if (!hasSupportRole(message.member)) {

      return message.reply(
        "❌ ما عندكش صلاحية تستعمل الأمر هذا."
      );

    }

    const target =
      message.mentions.members.first();

    if (!target) {

      return message.reply(
        "❌ منشن الشخص اللي تبي تحذفه من التكت."
      );

    }

    await channel.permissionOverwrites.delete(
      target.id
    );

    await channel.send(
      `✅ تم إزالة ${target} من التكت بواسطة ${message.author}.`
    );

  } catch (error) {

    console.error(
      "❌ +remove Error:",
      error
    );

  }

});

// ==========================================
// 🎫 +rename الاسم
// ==========================================

client.on("messageCreate", async (message) => {

  try {

    if (!message.guild || message.author.bot) return;

    const args =
      message.content.trim().split(/\s+/);

    if (
      args[0].toLowerCase() !== "+rename"
    ) return;

    const channel = message.channel;

    if (!isTicketChannel(channel)) {

      return message.reply(
        "❌ الأمر هذا يشتغل داخل التكتات فقط."
      );

    }

    if (!hasSupportRole(message.member)) {

      return message.reply(
        "❌ ما عندكش صلاحية تستعمل الأمر هذا."
      );

    }

    const newName =
      args.slice(1).join("-");

    if (!newName) {

      return message.reply(
        "❌ اكتب الاسم الجديد.\nمثال: `+rename مشكلة-شراء`"
      );

    }

    await channel.setName(
      `${TICKET_PREFIX}${newName}`
    );

    await channel.send(
      `✏️ تم تغيير اسم التكت إلى **${TICKET_PREFIX}${newName}** بواسطة ${message.author}.`
    );

  } catch (error) {

    console.error(
      "❌ +rename Error:",
      error
    );

  }

});

// ==========================================
// 🎫 +close
// ==========================================

client.on("messageCreate", async (message) => {

  try {

    if (!message.guild || message.author.bot) return;

    if (
      message.content.trim().toLowerCase() !==
      "+close"
    ) return;

    const channel = message.channel;

    if (!isTicketChannel(channel)) {

      return message.reply(
        "❌ الأمر هذا يشتغل داخل التكتات فقط."
      );

    }

    if (!hasSupportRole(message.member)) {

      return message.reply(
        "❌ ما عندكش صلاحية تسكر التكت."
      );

    }

    await message.reply(
      "🔒 جاري إغلاق التكت..."
    );

    await channel.permissionOverwrites.edit(
      message.guild.roles.everyone,
      {
        SendMessages: false
      }
    ).catch(() => {});

    await channel.send(
      `🔒 **تم إغلاق التكت بواسطة ${message.author}.**\n` +
      `🗑️ سيتم حذف التكت بعد **5 ثواني**.`
    );

    setTimeout(async () => {

      await channel.delete(
        "Ticket closed"
      ).catch(() => {});

    }, 5000);

  } catch (error) {

    console.error(
      "❌ +close Error:",
      error
    );

  }

});

// ==========================================
// 🚀 تشغيل البوت
// ==========================================

client.login(TOKEN);

console.log("🎫 Ticket System Loaded");
console.log("🚀 Bot Starting...");
