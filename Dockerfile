FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*

COPY ./dist/jiro/browser /usr/share/nginx/html

CMD ["exec nginx -g 'daemon off;'"]
