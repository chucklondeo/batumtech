# Batumtech 旧站线上实证审计

> 审计日期：2026-08-17  
> 范围：公开 HTTP 响应、robots.txt、sitemap.xml 与代表性 URL；不包含后台、数据库或服务器文件访问。

## 已确认事实

- `https://batumtech.com/` 返回 HTTP 200。
- 响应头暴露 `X-Powered-By: PHP/5.6.40`，确认旧站仍运行 PHP 5.6。
- 响应经 Hostinger hPanel / hCDN 提供，页面使用 PHP session，首页响应为动态且禁止缓存。
- `robots.txt` 禁止抓取 `/uploadfile/`，也禁止 `/images/`；这可能削弱百度图片抓取及图片资源发现能力。
- `sitemap.xml` 可访问，但其中 URL 主机名为历史域名 `www.batumparking.cn`，不是当前审计域名 `batumtech.com`。
- sitemap 的 `lastmod` 均显示为 2020-05-09，且注释表明由免费在线 sitemap 生成器创建，不能视为当前内容更新时间。
- 历史域名 `www.batumparking.cn` 的 HTTPS 证书已过期，严格 TLS 客户端无法访问代表性产品和新闻 URL。
- 将代表性 sitemap 路径放在 `batumtech.com` 下访问时，产品和新闻详情均返回 HTTP 200，说明当前站点仍兼容旧式 PHP 路由。

## 已识别 URL 结构

- 产品索引：`/index.php/product.html`
- 产品分类：`/index.php/product/typeid-{categoryId}.html`
- 产品详情：`/index.php/product/typeid-{categoryId}-id-{productId}.html`
- 产品详情别名：`/index.php/product/id-{productId}.html`
- 新闻索引：`/index.php/news.html`
- 新闻分类：`/index.php/news/typeid-{categoryId}.html`
- 新闻详情：`/index.php/news/typeid-{categoryId}-id-{newsId}.html`
- 新闻详情别名：`/index.php/news/id-{newsId}.html`
- 分页：查询参数 `page={n}`
- 固定页：`/index.php/about.html`、`/index.php/contact.html`

## 异常 URL 类型

sitemap 中存在包含域名文本的伪路径、空 ID 路径和重复内容入口，例如：

- `/www.batumtech.com`
- `/index.php/product/www.batumtech.com`
- `/index.php/product/typeid--id-.html`

这些 URL 不应直接批量跳转到首页。后续需逐条验证响应内容、canonical、流量与外链，再决定 301、410 或保留。

## 当前迁移决策

1. 把 sitemap URL 纳入迁移 inventory，但不把 sitemap 本身视为完整 URL 来源。
2. 同一内容的 `typeid + id` 与仅 `id` URL 需要选定一个最终 canonical，其余入口单跳 301。
3. 在上线前修复 sitemap 主机名，并仅输出当前主域名、HTTP 200、可索引的 canonical URL。
4. 图片迁移完成后调整 robots 规则，使公开产品图片可抓取；后台、临时目录和私有文件继续禁止。
5. 历史域名证书和域名控制权需单独核实；若仍归企业所有，应先恢复有效 TLS，再做跨域 301。

