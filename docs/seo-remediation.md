# SEO 风险修复实施说明

> 实施日期：2026-08-17

## 强制域名策略

- 新站唯一公开主域名为 `https://batumtech.com`。
- canonical、sitemap、robots host 和新站内部 URL 均由固定主域名工具生成，不读取请求 Host，防止错误域名污染索引。
- `www.batumtech.com` 单跳 301 到 `batumtech.com`。
- 若 `batumparking.cn` 或 `www.batumparking.cn` 请求到达新应用，也会单跳 301 到 `batumtech.com` 的对应路径。
- 迁移 inventory 允许在 `source_url` 中保留历史域名作为审计证据，但 `target_url` 和 `canonical_target` 只能是 `batumtech.com`。

## 旧 URL 归并

| 旧入口 | 唯一新入口 | 处理 |
|---|---|---|
| `/index.php/product/typeid-{typeId}-id-{id}.html` | `/products/{id}` | 301 |
| `/index.php/product/id-{id}.html` | `/products/{id}` | 301 |
| `/index.php/product/typeid-{typeId}.html` | `/products/category/{typeId}` | 301 |
| `/index.php/product.html?page={n}` | `/products` | 301，不保留重复分页参数 |
| `/index.php/news/typeid-{typeId}-id-{id}.html` | `/news/{id}` | 301 |
| `/index.php/news/id-{id}.html` | `/news/{id}` | 301 |
| `/index.php/news/typeid-{typeId}.html?page={n}` | `/news/category/{typeId}` | 301，不保留重复分页参数 |
| `/index.php/news.html?page={n}` | `/news` | 301，不保留重复分页参数 |
| `/index.php/about.html` | `/about` | 301 |
| `/index.php/contact.html` | `/contact` | 301 |

重定向目标均为最终规范 URL，不产生 301 链。详情和分类页面使用自引用 canonical。

## 无效 URL

空 ID 路径以及把域名错误拼进路径的 URL 返回 HTTP 410，并发送 `X-Robots-Tag: noindex`。这些入口不跳首页，以避免 soft 404。

## robots 与图片

新 `robots.txt` 明确允许 `/images/` 与 `/uploadfile/upfiles/`，仅阻止后台、API、私有目录和临时目录。旧图片完成迁移后必须继续使用原路径或提供单跳 301，且公开图片不得要求登录。

## sitemap

新 sitemap 仅生成 `https://batumtech.com` URL，并排除草稿、`noIndex` 内容、旧域名、重复入口和 410 URL。旧站 sitemap 不会复制到新站。

## 仍需在域名/托管层执行

应用代码无法签发或续期另一个域名的 TLS 证书。若企业仍控制 `batumparking.cn`，上线前必须：

1. 为根域名和 `www` 恢复有效证书。
2. 将 DNS/CDN 指向能够执行重定向的边缘或新站入口。
3. 在 TLS 握手成功后返回到 `https://batumtech.com` 的单跳 301。
4. 连续监控旧域名证书、301 命中和 404 至少 12 个月。

如果不再控制该域名，新站自身无法修复其证书；此时应确保新站任何页面、canonical、sitemap、结构化数据和内部链接都不再引用它。
