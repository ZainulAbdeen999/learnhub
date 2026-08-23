FROM node:20-slim

RUN apt-get update && apt-get install -y \
    python3 \
    gcc g++ \
    default-jdk \
    golang-go \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g tsx typescript

WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY server.js ./

EXPOSE 4000
CMD ["node", "server.js"]
