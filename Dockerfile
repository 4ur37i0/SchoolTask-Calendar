# Use PHP 8.2 with FPM and Alpine for a lightweight image
FROM php:8.2-fpm-alpine

# Add logs for build process
RUN echo "Starting Dockerfile build for Laravel + React project"

# Install system dependencies
RUN echo "Installing system dependencies..." && \
    apk add --no-cache \
        git \
        curl \
        libpng-dev \
        oniguruma-dev \
        libxml2-dev \
        zip \
        unzip \
        nodejs \
        npm \
        nginx \
        supervisor

# Clear cache
RUN echo "Clearing APK cache..." && \
    rm -rf /var/cache/apk/*

# Install PHP extensions
RUN echo "Installing PHP extensions..." && \
    docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Get latest Composer
RUN echo "Installing Composer..." && \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /var/www

# Copy composer files
COPY composer.json composer.lock* ./

# Copy artisan
COPY artisan ./

# Copy bootstrap
COPY bootstrap ./bootstrap

# Copy routes
COPY routes ./routes

# Copy app
COPY app ./app

# Install PHP dependencies
RUN echo "Installing PHP dependencies..." && \
    composer install --no-dev --optimize-autoloader --no-interaction

# Copy package files
COPY package.json package-lock.json* ./

# Install Node.js dependencies
RUN echo "Installing Node.js dependencies..." && \
    npm install

# Copy application code
COPY . .

# Build React assets
RUN echo "Building React assets..." && \
    npm run build

# Set permissions
RUN echo "Setting permissions..." && \
    chown -R www-data:www-data /var/www && \
    chmod -R 755 /var/www/storage && \
    chmod -R 755 /var/www/bootstrap/cache

# Copy Nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy Supervisor configuration
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose port 80
EXPOSE 80

# Start Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

# Final log
RUN echo "Dockerfile build completed successfully"