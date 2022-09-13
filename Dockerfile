FROM node:16
WORKDIR /app/client
COPY ./client/package* ./
RUN npm install
COPY ./client ./
RUN npm run build
CMD npx vite preview --host 0.0.0.0 --port $PORT
