FROM nginx

RUN rm /etc/nginx/conf.d/default.conf

COPY build /usr/share/nginx/html

COPY nginxconfig /etc/nginx/conf.d