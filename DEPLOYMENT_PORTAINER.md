# Deployment Guide for Portainer

This guide explains how to deploy the Coding Platform application using Portainer.

## Prerequisites

1. Docker installed
2. Portainer installed and running
3. Access to Portainer web interface
4. Traefik reverse proxy configured (for production deployment)

## Deployment Methods

### Method 1: Using docker-compose-prod.yml

1. Copy the `docker-compose-prod.yml` and `.env.production` files to your Portainer host
2. In Portainer:
   - Go to "Stacks"
   - Click "Add stack"
   - Choose "Repository" or "Upload" depending on your setup
   - If using Repository:
     - Repository URL: Your repository URL
     - Compose path: `docker-compose-prod.yml`
   - If using Upload:
     - Upload both `docker-compose-prod.yml` and `.env.production`
   - Set environment variables as needed
   - Click "Deploy the stack"

### Method 2: Using Portainer Stack Template

1. Copy the `portainer-stack.yml` file to your Portainer host
2. In Portainer:
   - Go to "Stacks"
   - Click "Add stack"
   - Choose "Repository" or "Upload"
   - If using Repository:
     - Repository URL: Your repository URL
     - Compose path: `portainer-stack.yml`
   - If using Upload:
     - Upload the `portainer-stack.yml` file
   - Click "Deploy the stack"

## Environment Variables

For production deployment, you should customize the following environment variables:

- `MYSQL_ROOT_PASSWORD`: Strong password for MySQL root user
- `MYSQL_USER`: MySQL user for the application
- `MYSQL_PASSWORD`: Strong password for the MySQL user
- `MYSQL_DATABASE`: Database name
- `JWT_SECRET`: Strong secret for JWT token signing
- `DOMAIN_NAME`: The domain name for the Alenia platform (default: academy.alenia.io)
- `API_BASE_URL`: The base URL for the API (default: https://api.academy.alenia.io)

## Alenia Domain Configuration

The application is configured to run on the Alenia domain (academy.alenia.io) by default. If you need to deploy to a different domain:

1. Update the `DOMAIN_NAME` and `API_BASE_URL` variables in your environment
2. Update the `REACT_APP_DOMAIN_NAME` and `REACT_APP_API_BASE_URL` variables for the frontend
3. Update the Traefik labels in the docker-compose files to match your domain
4. Ensure your DNS is configured to point to your server

## Database Management with phpMyAdmin

The deployment includes phpMyAdmin for database management and monitoring. After deployment, you can access phpMyAdmin at:

- phpMyAdmin: https://phpmyadmin.academy.alenia.io

Use the same database credentials configured in your environment variables to log in to phpMyAdmin.

## Versioning

The application includes version information displayed on the login page. To update the version:

1. Update the `REACT_APP_VERSION` environment variable in the docker-compose files
2. Update the version in both `backend/package.json` and `frontend/package.json` files
3. Rebuild and redeploy the application

## Traefik Configuration

The production deployment uses Traefik as a reverse proxy for routing traffic to the appropriate services. The configuration includes:

- Automatic SSL certificate generation via Let's Encrypt
- Routing rules for the frontend (academy.alenia.io)
- Routing rules for the backend API (api.academy.alenia.io)
- Routing rules for phpMyAdmin (phpmyadmin.academy.alenia.io)

Ensure your Traefik instance is configured with:
- A valid certificate resolver named "myresolver"
- Entry points configured for "websecure" (HTTPS)

## Security Considerations

1. Change all default passwords
2. Use strong JWT secrets
3. Don't expose Redis or MySQL ports externally
4. Use HTTPS in production (handled by Traefik)
5. Regularly update Docker images

## Accessing the Application

After deployment, the application will be available at:

For the Alenia domain deployment:
- Frontend: https://academy.alenia.io
- Backend API: https://api.academy.alenia.io
- phpMyAdmin: https://phpmyadmin.academy.alenia.io
- Health Check: https://api.academy.alenia.io/api/health

## Monitoring

Portainer provides monitoring capabilities for your stack:

1. View container logs in the "Containers" section
2. Check container status and resource usage
3. Monitor health checks
4. Review network connections

## Updating the Application

To update the application:

1. Update your repository with the latest changes
2. In Portainer, go to your stack
3. Click "Update the stack"
4. Select "Pull latest image" to get the newest images
5. Click "Update"

## Troubleshooting

Common issues:

1. **Database connection failures**:
   - Check MySQL container logs
   - Verify database credentials
   - Ensure MySQL container is healthy

2. **Application not starting**:
   - Check container logs
   - Verify environment variables
   - Check Traefik routing rules

3. **Health checks failing**:
   - Check service dependencies
   - Review container resource limits

4. **Traefik routing issues**:
   - Verify Traefik labels in docker-compose files
   - Check Traefik dashboard for routing information
   - Ensure DNS is properly configured

5. **phpMyAdmin access issues**:
   - Verify phpMyAdmin Traefik labels
   - Check database credentials
   - Ensure MySQL container is running and healthy