FROM node:16
WORKDIR /app/client
COPY ./client/package* ./
RUN npm install
COPY ./client ./
RUN npm run build

WORKDIR /app/server
COPY ./server/package* ./
RUN npm install
COPY ./server ./
RUN npx prisma migrate
RUN npm run build


WORKDIR /app/client
CMD npx vite preview --host 0.0.0.0 --port $CLIENT_PORT & node /app/server/build/server.js
