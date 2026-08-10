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
// ===============================
// 🛡️ AUTO MOD - Atlantis
// ===============================

const mentionTracker = new Map();

const PROTECTED_ROLE_ID = "1532780825534402771";

// الرتب اللي فوق رتبة الحماية + الرتبة نفسها مستثناة
function isProtected(member) {
    if (!member || !member.guild) return false;

    const protectedRole = member.guild.roles.cache.get(PROTECTED_ROLE_ID);
    if (!protectedRole) return false;

    return member.roles.highest.position >= protectedRole.position;
}

// روابط Discord
const discordInviteRegex =
    /(https?:\/\/)?(www\.)?(discord\.gg|discord\.com\/invite|discordapp\.com\/invite)\/[a-zA-Z0-9-]+/gi;

// أي رابط
const anyLinkRegex =
    /(https?:\/\/|www\.)[^\s]+/gi;

client.on("messageCreate", async (message) => {
    try {
        // تجاهل البوتات والرسائل بدون سيرفر
        if (!message.guild || message.author.bot) return;

        const member = message.member;

        // الإدارة العليا والرتبة المحمية مستثناة
        if (isProtected(member)) return;

        // =========================================
        // 🔗 حماية روابط Discord
        // =========================================

        if (discordInviteRegex.test(message.content)) {

            // حذف الرسالة
            await message.delete().catch(() => {});

            // Timeout لمدة ساعة
            if (member.moderatable) {
                await member.timeout(
                    60 * 60 * 1000,
                    "إرسال رابط سيرفر Discord ممنوع"
                ).catch(() => {});
            }

            // رسالة خاصة
            await member.send({
                content:
                    `⚠️ **تنبيه من سيرفر ${message.guild.name}**\n\n` +
                    `تم منعك من إرسال روابط سيرفرات Discord.\n` +
                    `تم إعطاؤك **Timeout لمدة ساعة** بسبب إرسال رابط Discord.`
            }).catch(() => {});

            return;
        }

        // =========================================
        // 🔗 حماية جميع الروابط الأخرى
        // =========================================

        if (anyLinkRegex.test(message.content)) {

            await message.delete().catch(() => {});

            await member.send({
                content:
                    `⚠️ **تنبيه من سيرفر ${message.guild.name}**\n\n` +
                    `الروابط ممنوعة في هذا السيرفر.`
            }).catch(() => {});

            return;
        }

        // =========================================
        // 📢 Anti Mention Spam
        // 3 منشنات خلال 4 ثواني
        // =========================================

        const mentionCount = message.mentions.users.size;

        if (mentionCount > 0) {

            const userId = message.author.id;
            const now = Date.now();

            if (!mentionTracker.has(userId)) {
                mentionTracker.set(userId, []);
            }

            const timestamps = mentionTracker.get(userId);

            // نحذف المحاولات الأقدم من 4 ثواني
            const recent = timestamps.filter(
                time => now - time <= 4000
            );

            recent.push(now);

            mentionTracker.set(userId, recent);

            // 3 رسائل فيها منشن خلال 4 ثواني
            if (recent.length >= 3) {

                // تصفير العداد
                mentionTracker.delete(userId);

                // حذف الرسالة الحالية
                await message.delete().catch(() => {});

                // Timeout 10 دقائق
                if (member.moderatable) {
                    await member.timeout(
                        10 * 60 * 1000,
                        "Spam mentions - 3 mentions within 4 seconds"
                    ).catch(() => {});
                }

                // تنبيه في الخاص
                await member.send({
                    content:
                        `⚠️ **تنبيه من سيرفر ${message.guild.name}**\n\n` +
                        `تم رصد استخدام المنشن بشكل مزعج.\n` +
                        `بسبب تكرار المنشن **3 مرات خلال 4 ثواني**، تم إعطاؤك ` +
                        `**Timeout لمدة 10 دقائق**.`
                }).catch(() => {});

                return;
            }
        }

    } catch (error) {
        console.error("❌ AutoMod Error:", error);
    }
});

// تنظيف بيانات المنشن كل دقيقة
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

console.log("🛡️ AutoMod System Loaded");
// ==========================================
// 🎫 TICKET - +come
// ==========================================

const TICKET_PREFIX = "🎫・";

client.on("messageCreate", async (message) => {
    try {
        if (!message.guild || message.author.bot) return;

        if (message.content.trim().toLowerCase() !== "+come") return;

        const channel = message.channel;

        // ==========================================
        // 🔎 التأكد إن القناة تكت
        // ==========================================

        if (!channel.name.startsWith(TICKET_PREFIX)) {
            return message.reply("❌ الأمر هذا يشتغل داخل التكتات فقط.");
        }

        // ==========================================
        // 👮 التأكد من صلاحية الموظف
        // ==========================================

        if (!message.member.permissions.has("ManageChannels")) {
            return message.reply("❌ ما عندكش صلاحية تستعمل الأمر هذا.");
        }

        // ==========================================
        // 👤 البحث عن صاحب التكت
        // ==========================================

        const memberOverwrites = channel.permissionOverwrites.cache.filter(
            overwrite =>
                overwrite.type === 1 &&
                overwrite.allow.has("ViewChannel") &&
                overwrite.id !== client.user.id
        );

        if (!memberOverwrites.size) {
            return message.reply(
                "❌ ما قدرتش نحدد صاحب التكت."
            );
        }

        const ownerOverwrite = memberOverwrites.first();

        const owner = await message.guild.members
            .fetch(ownerOverwrite.id)
            .catch(() => null);

        if (!owner) {
            return message.reply(
                "❌ صاحب التكت مش موجود في السيرفر."
            );
        }

        // ==========================================
        // 📢 الرسالة داخل التكت
        // ==========================================

        await channel.send({
            content:
                `📢 **${owner}**\n` +
                `الدعم محتاج ردك في التكت، يرجى الرجوع للتكت.`
        });

        // ==========================================
        // 📩 الرسالة في الخاص مباشرة
        // ==========================================

        await owner.send({
            content:
                `🎫 **تنبيه من سيرفر ${message.guild.name}**\n\n` +
                `الدعم محتاج ردك في التكت.\n` +
                `📌 التكت: **${channel.name}**\n\n` +
                `يرجى الرجوع للتكت والرد على الدعم.`
        }).catch(() => {});

        // ❌ لا توجد رسالة تأكيد للموظف

    } catch (error) {
        console.error("❌ Ticket Come Error:", error);
    }
});
// ==========================================
// 🎫 TICKET COMMANDS
// +claim / +add / +remove / +rename
// ==========================================

client.on("messageCreate", async (message) => {
    try {
        if (!message.guild || message.author.bot) return;

        const channel = message.channel;
        const content = message.content.trim();

        // ==========================================
        // 🔎 التأكد إن القناة تكت
        // ==========================================

        if (!channel.name.startsWith(TICKET_PREFIX)) return;

        // ==========================================
        // 👮 صلاحية موظف التكت
        // ==========================================

        if (!message.member.permissions.has("ManageChannels")) {
            return message.reply("❌ ما عندكش صلاحية تستعمل أوامر التكت.");
        }

        // ==========================================
        // 🎯 +CLAIM
        // ==========================================

        if (content.toLowerCase() === "+claim") {

            // نشوف هل التكت مستلم من قبل
            if (channel.topic && channel.topic.startsWith("claimed:")) {

                const claimedId = channel.topic.split(":")[1];

                const claimedMember = await message.guild.members
                    .fetch(claimedId)
                    .catch(() => null);

                if (claimedMember) {
                    return message.reply(
                        `❌ التكت هذا مستلمه بالفعل ${claimedMember}.`
                    );
                }
            }

            // تسجيل الموظف المستلم في Topic
            await channel.setTopic(
                `claimed:${message.author.id}`,
                `Ticket claimed by ${message.author.tag}`
            ).catch(() => {});

            await channel.send(
                `🎫 **تم استلام التكت بواسطة ${message.author}.**\n` +
                `📌 الموظف المسؤول عن التكت الآن هو ${message.author}.`
            );

            return;
        }

        // ==========================================
        // ➕ +ADD @USER
        // ==========================================

        if (content.toLowerCase().startsWith("+add ")) {

            const user = message.mentions.members.first();

            if (!user) {
                return message.reply(
                    "❌ لازم تعمل منشن للشخص.\nمثال: `+add @user`"
                );
            }

            // إضافة صلاحية مشاهدة وكتابة
            await channel.permissionOverwrites.edit(user.id, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true
            }).catch(() => {});

            await channel.send(
                `✅ تم إضافة ${user} إلى التكت بواسطة ${message.author}.`
            );

            return;
        }

        // ==========================================
        // ➖ +REMOVE @USER
        // ==========================================

        if (content.toLowerCase().startsWith("+remove ")) {

            const user = message.mentions.members.first();

            if (!user) {
                return message.reply(
                    "❌ لازم تعمل منشن للشخص.\nمثال: `+remove @user`"
                );
            }

            // منع إزالة البوت أو صاحب التكت بالخطأ
            if (user.id === client.user.id) {
                return message.reply("❌ ما تقدرش تزيل البوت من التكت.");
            }

            await channel.permissionOverwrites.delete(
                user.id,
                `Removed from ticket by ${message.author.tag}`
            ).catch(() => {});

            await channel.send(
                `✅ تم إزالة ${user} من التكت بواسطة ${message.author}.`
            );

            return;
        }

        // ==========================================
        // ✏️ +RENAME
        // ==========================================

        if (content.toLowerCase().startsWith("+rename ")) {

            const newName = content
                .slice("+rename ".length)
                .trim();

            if (!newName) {
                return message.reply(
                    "❌ اكتب الاسم الجديد.\nمثال: `+rename مشكلة-الحساب`"
                );
            }

            // تنظيف الاسم
            const cleanName = newName
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9\u0600-\u06FF\-_]/g, "")
                .slice(0, 80);

            if (!cleanName) {
                return message.reply("❌ الاسم غير صالح.");
            }

            const finalName = `🎫・${cleanName}`;

            await channel.setName(
                finalName,
                `Ticket renamed by ${message.author.tag}`
            );

            await channel.send(
                `✏️ تم تغيير اسم التكت إلى **${finalName}** بواسطة ${message.author}.`
            );

            return;
        }

    } catch (error) {
        console.error("❌ Ticket Commands Error:", error);
    }
});

console.log("🎫 Ticket Commands Loaded");
// ==========================================
// 🎫 TICKET - +close
// ==========================================

client.on("messageCreate", async (message) => {
    try {
        if (!message.guild || message.author.bot) return;

        // الأمر
        if (message.content.trim().toLowerCase() !== "+close") return;

        const channel = message.channel;

        // ==========================================
        // 🔎 التأكد إن القناة تكت
        // ==========================================

        if (!channel.name.startsWith(TICKET_PREFIX)) {
            return message.reply("❌ الأمر هذا يشتغل داخل التكتات فقط.");
        }

        // ==========================================
        // 👮 التأكد من صلاحية الموظف
        // ==========================================

        if (!message.member.permissions.has("ManageChannels")) {
            return message.reply("❌ ما عندكش صلاحية تسكر التكت.");
        }

        // ==========================================
        // 🔒 قفل التكت
        // ==========================================

        await message.reply("🔒 جاري إغلاق التكت...");

        // منع الأعضاء العاديين من الكتابة
        await channel.permissionOverwrites.edit(
            message.guild.roles.everyone,
            {
                SendMessages: false
            }
        ).catch(() => {});

        // ==========================================
        // ⏳ انتظار ثم حذف التكت
        // ==========================================

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
        console.error("❌ Ticket Close Error:", error);
    }
});

console.log("🔒 Ticket Close Loaded");
client.login(TOKEN);
