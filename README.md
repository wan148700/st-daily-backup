# ST Daily Backup — 酒馆每日自动备份（服务端插件）

每天固定时间自动把 SillyTavern 的 `data` 目录（角色/聊天/世界观/预设/设置）打包成 tar.gz，自动只保留最近 7 份。零人工，酒馆开着就跑。

## 安装
1. `config.yaml` 确认 `enableServerPlugins: true`
2. 克隆到 plugins 目录：
   ```bash
   cd SillyTavern/plugins
   git clone https://github.com/wan148700/st-daily-backup
   ```
3. 重启酒馆，终端看到 `[daily-backup] 下次备份时间: ...` 即生效

## 配置
编辑 `index.js` 开头：
- `BACKUP_HOUR`：每天几点备份（默认 4 点）
- `KEEP_COUNT`：保留几份（默认 7）

备份输出：`SillyTavern/backups/daily/`
