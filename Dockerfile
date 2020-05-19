FROM nginx:alpine
RUN npm install && npm run build
COPY build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/
CMD ["nginx", "-g", "daemon off;"]
