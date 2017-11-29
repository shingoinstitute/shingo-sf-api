FROM node

WORKDIR /code

COPY .dockerignore .dockerignore

COPY package.json package.json

COPY package-lock.json package-lock.json

COPY tsconfig.json tsconfig.json

RUN npm install -g typescript nodemon

RUN npm install

RUN tsc

ENV PORT=80

EXPOSE 80

ENTRYPOINT ["npm", "run"]

CMD ["start"]