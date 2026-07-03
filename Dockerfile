# Ohr Hanachal — static storefront mockup, served by nginx.
# Coolify: use the "Dockerfile" build pack with this folder as the base directory.
FROM nginx:1.27-alpine

# Copy only the site assets (keeps the image clean — no Dockerfile/configs served)
COPY *.html styles.css cart.js config.js /usr/share/nginx/html/

# Server config: clean URLs, gzip, asset caching
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Force IPv4 (nginx listens on 0.0.0.0:80; "localhost" can resolve to ::1 first).
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=5 \
  CMD wget -q --spider http://127.0.0.1:80/ || exit 1
