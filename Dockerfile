FROM node:16

WORKDIR /app/client
COPY ./client/package* ./
RUN npm install
COPY ./client ./

WORKDIR /app/server
COPY ./server/package* ./
COPY ./server ./
RUN npm install
RUN npm run build

# Cannot find prisma client ??
CMD npx prisma migrate deploy && npm run start
