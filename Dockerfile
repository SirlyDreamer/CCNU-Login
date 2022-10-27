FROM node:current-alpine

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app/CCNULogin

COPY ./login.js login.js

COPY ./package.json package.json

RUN apk -U --no-cache update \
    && apk -U --no-cache upgrade \
    && apk -U --no-cache --allow-untrusted add chromium nss harfbuzz ca-certificates ttf-freefont \
    && npm install

ENTRYPOINT ["node","login.js"]