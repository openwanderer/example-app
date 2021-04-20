# Installing PHP Dependencies
FROM composer:1 as installer

COPY composer.json /app

RUN composer install


# Building frontend
FROM node:10.13 as frontend

RUN mkdir -p /app/

COPY ./js /app

WORKDIR /app

RUN npm install && npx webpack


# Server
FROM php:7.2-apache

RUN apt-get update && apt-get install -y libpq-dev && \
  docker-php-ext-install pdo_pgsql && \
  docker-php-ext-install exif

RUN ln -s ../mods-available/rewrite.load /etc/apache2/mods-enabled/

COPY ./index.php /var/www/html/
COPY --from=installer /app/ /var/www/html/

COPY ./js/ /var/www/html/js/
COPY --from=frontend /app/dist/ /var/www/html/js/dist/
COPY ./css/ /var/www/html/css/
COPY ./images /var/www/html/images/
COPY ./views/ /var/www/html/views/

COPY ./openwanderer-php.ini ./openwanderer-php.ini
RUN cp ./openwanderer-php.ini "$PHP_INI_DIR/conf.d/"
