FROM keymetrics/pm2:latest-alpine

# Bundle APP files
COPY src src/
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY pm2.json .

ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install
RUN npm run-script compile

ENV PORT=80

EXPOSE 80

CMD ["pm2-runtime", "start", "pm2.json"]
