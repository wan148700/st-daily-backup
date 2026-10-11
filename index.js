// ===== ST Daily Backup - 酒馆每日自动备份服务端插件 =====
// 安装：放到 SillyTavern/plugins/st-daily-backup/ 目录
//       config.yaml 开启 enableServerPlugins: true
// 效果：每天固定时间把 data 目录打包成 tar.gz 存到 backups/daily/，
//       自动保留最近 7 份，酒馆启动即生效，零人工。

const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

// ===== 可按需修改 =====
const BACKUP_HOUR = 4;      // 每天几点备份（24小时制，本地时区）
const KEEP_COUNT = 7;       // 保留几份
// =====================

const ST_ROOT = path.join(__dirname, '..', '..');   // plugins/ 的上级 = 酒馆根目录
const DATA_DIR = path.join(ST_ROOT, 'data');
const OUT_DIR = path.join(ST_ROOT, 'backups', 'daily');

function log(msg) { console.log(`[daily-backup] ${msg}`); }

function doBackup() {
  try {
    if (!fs.existsSync(DATA_DIR)) { log('data 目录不存在，跳过'); return; }
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);
    const outFile = path.join(OUT_DIR, `st-daily-${stamp}.tar.gz`);

    execFile('tar', ['-czf', outFile, '-C', ST_ROOT, 'data'], (err) => {
      if (err) { log(`打包失败: ${err.message}`); return; }
      log(`备份完成: ${outFile}`);
      // 清理旧备份，只保留最近 KEEP_COUNT 份
      const files = fs.readdirSync(OUT_DIR)
        .filter(f => f.startsWith('st-daily-'))
        .sort();
      while (files.length > KEEP_COUNT) {
        const old = files.shift();
        fs.unlinkSync(path.join(OUT_DIR, old));
        log(`已删除旧备份: ${old}`);
      }
    });
  } catch (e) { log(`异常: ${e.message}`); }
}

function schedule() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(BACKUP_HOUR, 0, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  const delay = next - now;
  log(`下次备份时间: ${next.toLocaleString()}`);
  setTimeout(() => { doBackup(); setInterval(doBackup, 24 * 3600 * 1000); }, delay);
}

module.exports = { init: schedule };
