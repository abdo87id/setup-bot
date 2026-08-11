const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField
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
// 🔑 TOKEN
// ==========================================

const TOKEN = process.env.TOKEN;

// ==========================================
// 📌 IDs
// ==========================================

const WELCOME_CHANNEL = "1532781166468272311";

const ADMIN_ROLE_ID = "1532780829158146048";
const SUPPORT_ROLE_ID = "1532780834468139161";
const PROTECTED_ROLE_ID = "1532780825534402771";

// شكل أسماء التكتات
const TICKET_PREFIX = "🎫・";

// ==========================================
// 🚀 READY
// ==========================================

client.once("clientReady", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  console.log("🤖 Atlantis Bot is online.");
});

// ==========================================
// 👋 الترحيب
// ==========================================

client.on("guildMemberAdd", async (member) => {
  try {
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
      .setImage(member.guild.iconURL({ dynamic: true, size: 1024 }))
      .setTimestamp();

    await channel.send({
      embeds: [embed]
    });

  } catch (error) {
    console.log("❌ Welcome Error:", error);
  }
});

// ==========================================
// 🎫 رسالة إنشاء التكت
// ==========================================

client.on("channelCreate", async (channel) => {
  try {
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
        console.log("❌ Ticket Welcome Error:", error);
      }
    }, 3000);

  } catch (error) {
    console.log("❌ Channel Create Error:", error);
  }
});

// ==========================================
// 👮 التحقق من الرتب
// ==========================================

function hasAdminRole(member) {
  if (!member || !member.guild) return false;

  const role = member.guild.roles.cache.get(ADMIN_ROLE_ID);

  if (!role) return false;

  return member.roles.highest.position >= role.position;
}

function hasSupportRole(member) {
  if (!member || !member.guild) return false;

  const role = member.guild.roles.cache.get(SUPPORT_ROLE_ID);

  if (!role) return false;

  return member.roles.highest.position >= role.position;
}

// ==========================================
// 🛡️ الرتبة المحمية
// ==========================================

function isProtected(member) {
  if (!member || !member.guild) return false;

  const role = member.guild.roles.cache.get(PROTECTED_ROLE_ID);

  if (!role) return false;

  return member.roles.highest.position >= role.position;
}

// ==========================================
// ⏱️ تحويل الوقت
// ==========================================

function parseDuration(input) {
  if (!input) return null;

  const match = input
    .toLowerCase()
    .match(/^(\d+)(s|m|h|d|w)$/);

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
// 📢 @everyone GIF
// ==========================================

client.on("messageCreate", async (message) => {
  try {
    if (!message.guild || message.author.bot) return;

    if (!message.mentions.everyone) return;

    await message.channel.send({
      files: [
        {
          attachment: "./standard.gif",
          name: "standard.gif"
        }
      ]
    });

  } catch (error) {
    console.log("❌ Everyone GIF Error:", error);
  }
});

// ==========================================
// 🛡️ AUTO MOD
// ==========================================

const mentionTracker = new Map();

const discordInviteRegex =
  /(https?:\/\/)?(www\.)?(discord\.gg|discord\.com\/invite|discordapp\.com\/invite)\/[a-zA-Z0-9-]+/gi;

const anyLinkRegex =
  /(https?:\/\/|www\.)[^\s]+/gi;

client.on("messageCreate", async (message) => {
  try {
    if (!message.guild || message.author.bot) return;

    const member = message.member;

    if (!member) return;

    // الإدارة العليا والحماية مستثناة
    if (isProtected(member)) return;

    // ==========================================
    // 🔗 Discord Invites
    // ==========================================

    if (discordInviteRegex.test(message.content)) {

      await message.delete().catch(() => {});

      if (member.moderatable) {
        await member.timeout(
          60 * 60 * 1000,
          "إرسال رابط سيرفر Discord ممنوع"
        ).catch(() => {});
      }

      await member.send({
        content:
          `⚠️ **تنبيه من سيرفر ${message.guild.name}**\n\n` +
          `تم منعك من إرسال روابط سيرفرات Discord.\n` +
          `تم إعطاؤك **Timeout لمدة ساعة**.`
      }).catch(() => {});

      return;
    }

    // ==========================================
    // 🔗 الروابط
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
    // ==========================================

    const mentionCount = message.mentions.users.size;

    if (mentionCount > 0) {

      const userId = message.author.id;
      const now = Date.now();

      if (!mentionTracker.has(userId)) {
        mentionTracker.set(userId, []);
      }

      const timestamps = mentionTracker.get(userId);

      const recent = timestamps.filter(
        time => now - time <= 4000
      );

      recent.push(now);

      mentionTracker.set(userId, recent);

      if (recent.length >= 3) {

        mentionTracker.delete(userId);

        await message.delete().catch(() => {});

        if (member.moderatable) {
          await member.timeout(
            10 * 60 * 1000,
            "Spam mentions"
          ).catch(() => {});
        }

        await member.send({
          content:
            `⚠️ **تنبيه من سيرفر ${message.guild.name}**\n\n` +
            `تم رصد استخدام المنشن بشكل مزعج.\n` +
            `تم إعطاؤك **Timeout لمدة 10 دقائق**.`
        }).catch(() => {});

        return;
      }
    }

  } catch (error) {
    console.log("❌ AutoMod Error:", error);
  }
});

// تنظيف بيانات المنشن
setInterval(() => {

  const now = Date.now();

  for (const [userId, timestamps] of mentionTracker.entries()) {

    const recent = timestamps.filter(
      time => now - time <= 4000
    );

    if (recent.length === 0) {
      mentionTracker.delete(userId);
    } else {
      mentionTracker.set(userId, recent);
    }
  }

}, 60 * 1000);

// ==========================================
// 👮 أوامر الإدارة
// ==========================================

client.on("messageCreate", async (message) => {

  try {

    if (!message.guild || message.author.bot) return;

    const args = message.content.trim().split(/\s+/);

    const command = args[0].toLowerCase();

    // ==========================================
    // 🔒 قفل
    // ==========================================

    if (command === "قفل") {

      if (!hasAdminRole(message.member)) {
        return message.reply("❌ ما عندكش صلاحية.");
      }

      await message.channel.permissionOverwrites.edit(
        message.guild.roles.everyone,
        {
          SendMessages: false
        }
      );

      return message.channel.send("🔒 تم قفل الشات.");
    }

    // ==========================================
    // 🔓 فتح
    // ==========================================

    if (command === "فتح") {

      if (!hasAdminRole(message.member)) {
        return message.reply("❌ ما عندكش صلاحية.");
      }

      await message.channel.permissionOverwrites.edit(
        message.guild.roles.everyone,
        {
          SendMessages: null
        }
      );

      return message.channel.send("🔓 تم فتح الشات.");
    }

    // ==========================================
    // 🧹 مسح
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

      return;
    }

    // ==========================================
    // 🔊 سحب / تعال
    // ==========================================

    if (
      command === "سحب" ||
      command === "تعال"
    ) {

      if (!hasSupportRole(message.member)) {
        return message.reply("❌ ما عندكش صلاحية للسحب.");
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
        !message.guild.members.me.permissions.has(
          PermissionsBitField.Flags.MoveMembers
        )
      ) {
        return message.reply(
          "❌ البوت ما عندهش صلاحية Move Members."
        );
      }

      await target.voice.setChannel(
        voiceChannel
      );

      return message.reply(
        `🔊 تم سحب ${target} إلى **${voiceChannel.name}**.`
      );
    }

    // ==========================================
    // 🔇 كتم
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
    }

    // ==========================================
    // 🔊 فك الكتم
    // ==========================================

    if (
      command === "ادوي" ||
      command === "فك"
    ) {

      if (!hasAdminRole(message.member)) {
        return message.reply("❌ ما عندكش صلاحية.");
      }

      const target =
        message.mentions.members.first();

      if (!target) {
        return message.reply(
          "❌ منشن الشخص اللي تبي تفك عليه الكتم."
        );
      }

      await target.timeout(null);

      return message.reply(
        `🔊 تم فك الكتم عن ${target}.`
      );
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

      await target.ban({
        reason:
          `تم الحظر بواسطة ${message.author.tag}`
      });

      return message.channel.send(
        `🔨 تم حظر **${target.user.tag}** من السيرفر.`
      );
    }

    // ==========================================
    // 👢 طرد
    // ==========================================

    if (
      command === "طرد" ||
      command === "طير"
    ) {

      if (!hasAdminRole(message.member)) {
        return message.reply(
          "❌ ما عندكش صلاحية للطرد."
        );
      }

      const target =
        message.mentions.members.first();

      if (!target) {
        return message.reply(
          "❌ منشن الشخص اللي تبي تطرده."
        );
      }

      if (!target.kickable) {
        return message.reply(
          "❌ ما نقدرش نطرد هذا الشخص."
        );
      }

      await target.kick(
        `تم الطرد بواسطة ${message.author.tag}`
      );

      return message.channel.send(
        `👢 تم طرد **${target.user.tag}** من السيرفر.`
      );
    }

  } catch (error) {

    console.log("❌ Admin Command Error:", error);

    if (!message.replied && !message.deferred) {
      message.reply(
        "❌ صار خطأ أثناء تنفيذ الأمر."
      ).catch(() => {});
    }

  }

});

// ==========================================
// 🎫 أدوات التكت
// ==========================================

function isTicketChannel(channel) {
  return (
    channel &&
    channel.name &&
    channel.name.startsWith(TICKET_PREFIX)
  );
}

// البحث عن صاحب التكت من صلاحيات الروم
// ==========================================
// 🔎 البحث عن صاحب التكت
// Wick Embed + Permission Overwrites
// ==========================================

async function findTicketOwner(channel) {

  try {

    // ==========================================
    // 🔎 الطريقة الأولى: البحث في رسائل Wick
    // ==========================================

    const messages = await channel.messages.fetch({
      limit: 50
    }).catch(() => null);

    if (messages) {

      for (const msg of messages.values()) {

        for (const embed of msg.embeds) {

          if (!embed.fields) continue;

          for (const field of embed.fields) {

            const name = String(
              field.name || ""
            ).toLowerCase();

            const value = String(
              field.value || ""
            );

            if (
              name.includes("مالك التذكرة") ||
              name.includes("مالك التكت") ||
              name.includes("ticket owner") ||
              name.includes("ticket creator") ||
              name.includes("owner")
            ) {

              const match =
                value.match(/<@!?(\d{17,20})>/);

              if (match) {

                const member =
                  await channel.guild.members
                    .fetch(match[1])
                    .catch(() => null);

                if (member && !member.user.bot) {
                  return member;
                }
              }
            }

            const idMatch =
              value.match(/\b\d{17,20}\b/);

            if (
              name.includes("مالك") &&
              idMatch
            ) {

              const member =
                await channel.guild.members
                  .fetch(idMatch[0])
                  .catch(() => null);

                if (member && !member.user.bot) {
                  return member;
                }
            }

          }
        }
      }
    }

    // ==========================================
    // 🔎 الطريقة الثانية: Permission Overwrites
    // ==========================================

    for (
      const overwrite of
      channel.permissionOverwrites.cache.values()
    ) {

      if (overwrite.type !== 1) continue;

      if (!overwrite.allow.has("ViewChannel")) {
        continue;
      }

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

  } catch (error) {

    console.log(
      "❌ Ticket Owner Error:",
      error
    );

  }

  return null;
}
// ==========================================
// 🎫 أوامر التكت
// +come
// +claim
// +add
// +remove
// +rename
// +close
// ==========================================

client.on("messageCreate", async (message) => {

  try {

    if (!message.guild || message.author.bot) {
      return;
    }

    const content =
      message.content.trim();

    const lower =
      content.toLowerCase();

    if (!lower.startsWith("+")) {
      return;
    }

    const args =
      content.split(/\s+/);

    const command =
      args[0].toLowerCase();

    const channel =
      message.channel;

    // ==========================================
    // 🔎 كل أوامر التكت لازم داخل تكت
    // ==========================================

    const ticketCommands = [
      "+come",
      "+claim",
      "+add",
      "+remove",
      "+rename",
      "+close"
    ];

    if (
      ticketCommands.includes(command) &&
      !isTicketChannel(channel)
    ) {
      return message.reply(
        "❌ الأمر هذا يشتغل داخل التكتات فقط."
      );
    }

    // ==========================================
    // 📢 +come
    // ==========================================

    if (command === "+come") {

      if (!message.member.permissions.has(
        PermissionsBitField.Flags.ManageChannels
      )) {
        return message.reply(
          "❌ ما عندكش صلاحية تستعمل الأمر هذا."
        );
      }

      const owner =
        await findTicketOwner(channel);

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
          `📢 **تنبيه من 𝐀𝐓𝐋𝐀𝐍𝐓𝐈𝐒 𝐂𝐈𝐓𝐘 𝐂𝐅𝐖**\n\n` +
          `الدعم محتاج ردك في التكت:\n` +
          `${channel}`
      }).catch(() => {});

      return;
    }

    // ==========================================
    // 👋 +claim
    // ==========================================

    if (command === "+claim") {

      if (!hasSupportRole(message.member)) {
        return message.reply(
          "❌ ما عندكش صلاحية تستعمل +claim."
        );
      }

      const oldName =
        channel.name.replace(/^🎫・/, "");

      if (!channel.name.includes("・")) {
        return message.reply(
          "❌ ما قدرتش نحدد اسم التكت."
        );
      }

      const claimedName =
        `🎫・${oldName}`;

      await channel.setName(
        claimedName
      ).catch(() => {});

      await channel.send(
        `🎫 **تم استلام التكت بواسطة ${message.author}.**`
      );

      return;
    }

    // ==========================================
    // ➕ +add
    // ==========================================

    if (command === "+add") {

      if (!message.member.permissions.has(
        PermissionsBitField.Flags.ManageChannels
      )) {
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

      return message.channel.send(
        `✅ تم إضافة ${target} إلى التكت.`
      );
    }

    // ==========================================
    // ➖ +remove
    // ==========================================

    if (command === "+remove") {

      if (!message.member.permissions.has(
        PermissionsBitField.Flags.ManageChannels
      )) {
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
      ).catch(() => {});

      return message.channel.send(
        `✅ تم إزالة ${target} من التكت.`
      );
    }

    // ==========================================
    // ✏️ +rename
    // ==========================================

    if (command === "+rename") {

      if (!message.member.permissions.has(
        PermissionsBitField.Flags.ManageChannels
      )) {
        return message.reply(
          "❌ ما عندكش صلاحية تستعمل الأمر هذا."
        );
      }

      const newName =
        args.slice(1).join("-");

      if (!newName) {
        return message.reply(
          "❌ اكتب الاسم الجديد.\nمثال: `+rename طلب-تعويض`"
        );
      }

      const safeName =
        newName
          .toLowerCase()
          .replace(/[^a-zA-Z0-9\u0600-\u06FF\-]/g, "-")
          .slice(0, 80);

      await channel.setName(
        `${TICKET_PREFIX}${safeName}`
      );

      return message.channel.send(
        `✏️ تم تغيير اسم التكت إلى **${channel.name}**.`
      );
    }

    // ==========================================
    // 🔒 +close
    // ==========================================

    if (command === "+close") {

      if (!message.member.permissions.has(
        PermissionsBitField.Flags.ManageChannels
      )) {
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

      return;
    }

  } catch (error) {

    console.log("❌ Ticket Command Error:", error);

  }

});

// ==========================================
// 🛡️ ANTI-NUKE
// حماية الرومات والرتب والصلاحيات والباند والكِيك
// ==========================================

const antiNukeTracker = new Map();

const ANTI_NUKE_WINDOW = 10000;
const ANTI_NUKE_LIMIT = 3;

function trackAction(guildId, userId, action) {

  const key =
    `${guildId}:${userId}:${action}`;

  const now = Date.now();

  if (!antiNukeTracker.has(key)) {
    antiNukeTracker.set(key, []);
  }

  const list =
    antiNukeTracker.get(key);

  const recent =
    list.filter(
      time => now - time <= ANTI_NUKE_WINDOW
    );

  recent.push(now);

  antiNukeTracker.set(
    key,
    recent
  );

  return recent.length;
}

async function punishNuker(guild, userId, reason) {

  try {

    const member =
      await guild.members
        .fetch(userId)
        .catch(() => null);

    if (!member) return;

    // الرتب المحمية لا يتم معاقبتها
    if (isProtected(member)) return;

    if (member.bannable) {

      await member.ban({
        reason:
          `Anti-Nuke: ${reason}`
      }).catch(() => {});

      return;
    }

    if (member.kickable) {

      await member.kick(
        `Anti-Nuke: ${reason}`
      ).catch(() => {});

    }

  } catch (error) {

    console.log(
      "❌ Anti-Nuke Punishment Error:",
      error
    );

  }

}

// ==========================================
// 🏠 إنشاء / حذف / تعديل الرومات
// ==========================================

client.on("channelCreate", async (channel) => {

  try {

    if (!channel.guild) return;

    const audit =
      await channel.guild.fetchAuditLogs({
        type: 10,
        limit: 1
      }).catch(() => null);

    if (!audit) return;

    const entry =
      audit.entries.first();

    if (!entry) return;

    if (
      Date.now() - entry.createdTimestamp >
      5000
    ) return;

    const user =
      entry.executor;

    if (!user || user.bot) return;

    const member =
      await channel.guild.members
        .fetch(user.id)
        .catch(() => null);

    if (!member) return;

    if (isProtected(member)) return;

    const count =
      trackAction(
        channel.guild.id,
        user.id,
        "channelCreate"
      );

    if (count >= ANTI_NUKE_LIMIT) {
      
      await punishNuker(
        channel.guild,
        user.id,
        "إنشاء رومات بشكل تخريبي"
      );

    }

  } catch (error) {

    console.log(
      "❌ Channel Create Protection Error:",
      error
    );

  }

});

client.on("channelDelete", async (channel) => {

  try {

    if (!channel.guild) return;

    const audit =
      await channel.guild.fetchAuditLogs({
        type: 12,
        limit: 1
      }).catch(() => null);

    if (!audit) return;

    const entry =
      audit.entries.first();

    if (!entry) return;

    if (
      Date.now() - entry.createdTimestamp >
      5000
    ) return;

    const user =
      entry.executor;

    if (!user || user.bot) return;

    const member =
      await channel.guild.members
        .fetch(user.id)
        .catch(() => null);

    if (!member) return;

    if (isProtected(member)) return;

    const count =
      trackAction(
        channel.guild.id,
        user.id,
        "channelDelete"
      );

    if (count >= ANTI_NUKE_LIMIT) {

      await punishNuker(
        channel.guild,
        user.id,
        "حذف رومات بشكل تخريبي"
      );

    }

  } catch (error) {

    console.log(
      "❌ Channel Delete Protection Error:",
      error
    );

  }

});

// ==========================================
// 🏷️ إنشاء / حذف / تعديل الرتب
// ==========================================

client.on("roleCreate", async (role) => {

  try {

    const guild =
      role.guild;

    const audit =
      await guild.fetchAuditLogs({
        type: 30,
        limit: 1
      }).catch(() => null);

    if (!audit) return;

    const entry =
      audit.entries.first();

    if (!entry) return;

    if (
      Date.now() - entry.createdTimestamp >
      5000
    ) return;

    const user =
      entry.executor;

    if (!user || user.bot) return;

    const member =
      await guild.members
        .fetch(user.id)
        .catch(() => null);

    if (!member) return;

    if (isProtected(member)) return;

    const count =
      trackAction(
        guild.id,
        user.id,
        "roleCreate"
      );

    if (count >= ANTI_NUKE_LIMIT) {

      await punishNuker(
        guild,
        user.id,
        "إنشاء رتب بشكل تخريبي"
      );

    }

  } catch (error) {

    console.log(
      "❌ Role Create Protection Error:",
      error
    );

  }

});

client.on("roleDelete", async (role) => {

  try {

    const guild =
      role.guild;

    const audit =
      await guild.fetchAuditLogs({
        type: 32,
        limit: 1
      }).catch(() => null);

    if (!audit) return;

    const entry =
      audit.entries.first();

    if (!entry) return;

    if (
      Date.now() - entry.createdTimestamp >
      5000
    ) return;

    const user =
      entry.executor;

    if (!user || user.bot) return;

    const member =
      await guild.members
        .fetch(user.id)
        .catch(() => null);

    if (!member) return;

    if (isProtected(member)) return;

    const count =
      trackAction(
        guild.id,
        user.id,
        "roleDelete"
      );

    if (count >= ANTI_NUKE_LIMIT) {

      await punishNuker(
        guild,
        user.id,
        "حذف رتب بشكل تخريبي"
      );

    }

  } catch (error) {

    console.log(
      "❌ Role Delete Protection Error:",
      error
    );

  }

});

// ==========================================
// 🚨 دخول بوت جديد
// ==========================================

client.on("guildMemberAdd", async (member) => {

  try {

    if (!member.user.bot) return;

    const guild =
      member.guild;

    const audit =
      await guild.fetchAuditLogs({
        type: 28,
        limit: 1
      }).catch(() => null);

    if (!audit) return;

    const entry =
      audit.entries.first();

    if (!entry) return;

    if (
      Date.now() - entry.createdTimestamp >
      10000
    ) return;

    const executor =
      entry.executor;

    if (!executor) return;

    const staff =
      await guild.members
        .fetch(executor.id)
        .catch(() => null);

    if (!staff) return;

    if (isProtected(staff)) return;

    const count =
      trackAction(
        guild.id,
        executor.id,
        "botAdd"
      );

    if (count >= ANTI_NUKE_LIMIT) {

      await member.kick(
        "Anti-Nuke: إضافة بوتات بشكل مشبوه"
      ).catch(() => {});

      await punishNuker(
        guild,
        executor.id,
        "إضافة بوتات بشكل مشبوه"
      );

    }

  } catch (error) {

    console.log(
      "❌ Bot Protection Error:",
      error
    );

  }

});

// ==========================================
// 🔨 حظر عضو
// ==========================================

client.on("guildBanAdd", async (ban) => {

  try {

    const guild =
      ban.guild;

    const audit =
      await guild.fetchAuditLogs({
        type: 22,
        limit: 1
      }).catch(() => null);

    if (!audit) return;

    const entry =
      audit.entries.first();

    if (!entry) return;

    if (
      Date.now() - entry.createdTimestamp >
      5000
    ) return;

    const user =
      entry.executor;

    if (!user || user.bot) return;

    const member =
      await guild.members
        .fetch(user.id)
        .catch(() => null);

    if (!member) return;

    if (isProtected(member)) return;

    const count =
      trackAction(
        guild.id,
        user.id,
        "ban"
      );

    if (count >= ANTI_NUKE_LIMIT) {

      await punishNuker(
        guild,
        user.id,
        "حظر أعضاء بشكل تخريبي"
      );

    }

  } catch (error) {

    console.log(
      "❌ Ban Protection Error:",
      error
    );

  }

});

// ==========================================
// 👢 طرد عضو
// ==========================================

client.on("guildMemberRemove", async (member) => {

  try {

    const guild =
      member.guild;

    const audit =
      await guild.fetchAuditLogs({
        type: 20,
        limit: 1
      }).catch(() => null);

    if (!audit) return;

    const entry =
      audit.entries.first();

    if (!entry) return;

    if (
      Date.now() - entry.createdTimestamp >
      5000
    ) return;

    const user =
      entry.executor;

    if (!user || user.bot) return;

    const staff =
      await guild.members
        .fetch(user.id)
        .catch(() => null);

    if (!staff) return;

    if (isProtected(staff)) return;

    const count =
      trackAction(
        guild.id,
        user.id,
        "kick"
      );

    if (count >= ANTI_NUKE_LIMIT) {

      await punishNuker(
        guild,
        user.id,
        "طرد أعضاء بشكل تخريبي"
      );

    }

  } catch (error) {

    console.log(
      "❌ Kick Protection Error:",
      error
    );

  }

});

// ==========================================
// 🧹 تنظيف Anti-Nuke
// ==========================================

setInterval(() => {

  const now = Date.now();

  for (
    const [key, timestamps]
    of antiNukeTracker.entries()
  ) {

    const recent =
      timestamps.filter(
        time =>
          now - time <= ANTI_NUKE_WINDOW
      );

    if (recent.length === 0) {

      antiNukeTracker.delete(key);

    } else {

      antiNukeTracker.set(
        key,
        recent
      );

    }

  }

}, 60000);

// ==========================================
// 🤖 LOGIN
// ==========================================

client.login(TOKEN);
