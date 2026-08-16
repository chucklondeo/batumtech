# 旧站迁移输入清单

当前指定旧站目录：

`C:\Users\Chuck\WPSDrive\528307941\WPS云盘\巴图姆科技\CODEX\batumteh`

截至 2026-08-16，该目录存在但为空，且不是 Git 仓库。完成 WPS 云盘本地同步后，至少应出现：

- PHP CMS 完整源码及模板。
- Apache `.htaccess` 或 Nginx rewrite 配置。
- MySQL 导出文件，包含 DDL 与数据；凭据必须脱敏。
- `uploadfile/upfiles` 完整图片目录。
- 可选但重要：sitemap、访问日志和百度搜索资源平台导出。

这些输入仅作为只读迁移源，不应提交到公开 GitHub 仓库。收到后重新生成字段映射、媒体 manifest 与逐 URL 迁移清单。
