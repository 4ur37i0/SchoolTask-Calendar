FROM php:8.3-fpm-alpine

# Install required system packages and build dependencies
RUN apk add --no-cache \
        git \
        curl \
        bash \
        libpng-dev \
        libjpeg-turbo-dev \
        freetype-dev \
        libwebp-dev \
        zlib-dev \
        libzip-dev \
        oniguruma-dev \
        libxml2-dev \
        zip \
        unzip \
        nodejs \
        npm \
        nginx \
        supervisor \
    && rm -rf /var/cache/apk/*

# Configure and install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www

# Copy dependency manifests and minimal app files needed by composer scripts
COPY composer.json composer.lock* ./
COPY package.json package-lock.json* ./
COPY artisan ./
COPY bootstrap ./bootstrap
COPY routes ./routes
COPY app ./app

RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist \
    && npm install

# Copy application source
COPY . .

# Build front-end assets
ARG VITE_GOOGLE_CLIENT_ID
RUN npm run build

# Set permissions for storage and cache
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage /var/www/bootstrap/cache

# Copy service configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

# Final log
RUN echo "Dockerfile build completed successfully"