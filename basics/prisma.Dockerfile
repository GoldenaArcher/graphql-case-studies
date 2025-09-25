FROM node:22

WORKDIR /app

RUN npm install -g prisma@6.16.2

CMD ["prisma", "studio"]
