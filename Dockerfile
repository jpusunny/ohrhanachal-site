# Ohr Hanachal — static storefront mockup, served by nginx.
# Coolify: use the "Dockerfile" build pack with this folder as the base directory.
FROM nginx:1.27-alpine

# Copy only the site assets (keeps the image clean — no Dockerfile/configs served)
COPY *.html styles.css cart.js /usr/share/nginx/html/

# Server config: clean URLs, gzip, asset caching
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1
