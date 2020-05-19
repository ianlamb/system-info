FROM node:12.16.1-alpine3.11 as base
COPY package*.json ./
RUN npm ci
COPY . .

FROM base as build
RUN npm run build

FROM nginx:alpine
COPY --from=build /build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/
CMD ["nginx", "-g", "daemon off;"]
