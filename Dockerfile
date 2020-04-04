FROM nginx:alpine
RUN npm ci && npm build
COPY build /usr/share/nginx/html