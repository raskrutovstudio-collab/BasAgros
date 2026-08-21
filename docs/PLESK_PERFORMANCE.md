# Plesk / server performance checklist

Этот файл — checklist. Он не является командой автоматически менять production server.

Проверить:
- HTTPS;
- единый canonical host;
- HTTP/2 или HTTP/3 по возможностям stack;
- gzip/Brotli;
- long cache для versioned static assets;
- корректные MIME для WebP/AVIF/WOFF2;
- отсутствие redirect chains;
- custom 404;
- security headers по совместимости;
- robots.txt;
- sitemap.xml;
- form/API responses не кешируются как static.

`templates/.htaccess-performance.example` — только пример. Перед применением нужно проверить
реальную конфигурацию Apache/nginx/Plesk.
