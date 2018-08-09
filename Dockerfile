FROM node:8-alpine as build
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --silent
COPY . .
RUN npm run build

## STEP 2: Run Production ##
FROM node:8-alpine as prod
COPY --from=build /build/ build
COPY --from=build /package.json package.json
RUN npm install --production --silent
EXPOSE 80
ENV PORT 80
ENV LOG_PATH ./
ENV LOG_FILE shingo-sf-api.log
ENV NODE_ENV production
ENV LOG_LEVEL info
CMD npm start

FROM prod as debug
COPY --from=build /node_modules/ /node_modules
ENV NODE_ENV development
CMD npm run debug

FROM prod