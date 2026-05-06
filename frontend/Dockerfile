FROM node:20-alpine

WORKDIR /app

COPY frontend/package.json /app/package.json
COPY frontend/package-lock.json /app/package-lock.json

RUN npm install

COPY frontend /app

ENV NODE_ENV=development

EXPOSE 24000

CMD ["npm", "run", "dev"]