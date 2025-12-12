FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine
RUN npm install -g serve

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 3000

CMD ["serve", "-s", "/usr/share/nginx/html"]