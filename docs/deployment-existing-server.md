# 现有服务器部署方案

## 目标架构

- 旧 PHP 站在正式切换前保持不变。
- Next.js + Payload 运行于 Docker，绑定 `127.0.0.1:3001`，不直接暴露公网。
- PostgreSQL 仅在 Docker 网络中访问，不映射公网端口。
- `postgres-data` 保存数据库，`media-data` 保存 Payload 上传图片。
- Nginx 负责 HTTPS、请求限制和反向代理。
- GitHub `main` 分支更新后，通过 SSH 调用服务器部署脚本。

## 首次部署

1. 确认服务器安装 Git、Docker Engine、Docker Compose Plugin、curl 和 Nginx。
2. 建立独立目录，例如 `/www/wwwroot/batumtech-next`，克隆本仓库。
3. 将 `.env.production.example` 复制为 `.env.production`。
4. 生成独立的 PostgreSQL 密码和至少 32 字符的 `PAYLOAD_SECRET`，不要提交该文件。
5. 执行 `sh scripts/deploy-production.sh`。
6. 在服务器执行 `curl http://127.0.0.1:3001/api/health`，应返回 `status: ok`。
7. 先使用临时域名反向代理到 `127.0.0.1:3001`，完成页面、CMS、媒体、301 和 410 验证。
8. 备份旧 PHP 目录、MySQL 数据库和 Nginx 配置。
9. 将正式域名的 Nginx `location /` 替换为 `deploy/nginx/batumtech-next.conf` 中的配置。
10. 执行 `nginx -t`，通过后平滑重载 Nginx。

## GitHub 自动部署密钥

在 GitHub 仓库的 `production` Environment 中配置：

- `SSH_HOST`：服务器地址。
- `SSH_PORT`：SSH 端口，通常为 `22`。
- `SSH_USER`：仅拥有部署目录和 Docker 权限的部署用户，不推荐直接使用 root。
- `SSH_PRIVATE_KEY`：专用部署密钥的私钥。
- `SSH_KNOWN_HOSTS`：经人工核验的服务器 host key，不要在流水线中临时信任未知主机。
- `DEPLOY_PATH`：服务器上的绝对部署目录。
- 仓库变量 `AUTO_DEPLOY_ENABLED`：首次部署验证完成后设置为 `true`，在此之前 `main` 推送只会跳过生产部署。

建议为 `production` Environment 开启人工审批。首次部署和正式域名切换均人工执行；确认稳定后，再决定是否取消每次部署审批。

## 自动更新与回滚

部署脚本只接受 `main` 的 fast-forward 更新，工作目录存在人工改动时会安全失败。新镜像完成构建后才替换应用容器；健康检查失败时，脚本会恢复上一应用镜像。数据库和媒体卷不会随应用容器重建而删除。

正式迁移阶段仍需单独备份 PostgreSQL，并在执行 Payload 数据库迁移前审核迁移文件。应用镜像回滚不等于数据库结构回滚。
