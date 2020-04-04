FROM nginx:alpine
RUN npm install && npm build
COPY build /usr/share/nginx/html