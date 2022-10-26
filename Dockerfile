FROM node:current-alpine

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app/CCNULogin

RUN apk -U --no-cache update \
    && apk -U --no-cache upgrade \
    && apk -U --no-cache --allow-untrusted add chromium nss harfbuzz ca-certificates ttf-freefont \
    && npm install puppeteer -g

COPY ./login.js login.js

ENTRYPOINT ["node","login.js"]