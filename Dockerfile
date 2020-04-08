FROM nginx:alpine
COPY build /usr/share/nginx/html
#COPY nginx.conf /etc/nginx/
#EXPOSE 8080
#CMD ["nginx", "-g", "daemon off;"]