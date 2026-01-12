# Deployment Guide - HisMedFront to Linux Server

This guide provides step-by-step instructions for deploying the Angular application to a Linux server using Docker and GitHub.

## Prerequisites

- Linux server with SSH access
- Docker and Docker Compose installed on the server
- Git installed on the server
- GitHub repository with your code

## Installation Steps on Linux Server

### 1. Install Docker and Docker Compose

```bash
# Update package index
sudo apt update

# Install prerequisites
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (optional, to run docker without sudo)
sudo usermod -aG docker $USER
# Log out and back in for this to take effect
```

### 2. Install Git (if not already installed)

```bash
sudo apt install -y git
```

### 3. Clone Your Repository

```bash
# Navigate to your desired directory
cd /opt

# Clone the repository
sudo git clone https://github.com/YOUR_USERNAME/HisMedFront.git

# Change ownership to your user
sudo chown -R $USER:$USER HisMedFront

# Navigate to the project directory
cd HisMedFront
```

### 4. Configure Environment (if needed)

```bash
# If you have environment-specific configurations, create or edit them
# For example, update API endpoints in environment.prod.ts before building
nano src/environments/environment.prod.ts
```

### 5. Build and Run with Docker

#### Option A: Using Docker Compose (Recommended)

```bash
# Build and start the container
docker compose up -d --build

# View logs
docker compose logs -f

# Stop the container
docker compose down

# Restart the container
docker compose restart
```

#### Option B: Using Docker Commands

```bash
# Build the Docker image
docker build -t hismedfront:latest .

# Run the container
docker run -d -p 80:80 --name hismedfront --restart unless-stopped hismedfront:latest

# View logs
docker logs -f hismedfront

# Stop the container
docker stop hismedfront

# Start the container
docker start hismedfront

# Remove the container
docker rm hismedfront
```

### 6. Configure Firewall

```bash
# Allow HTTP traffic
sudo ufw allow 80/tcp

# Allow HTTPS traffic (if using SSL)
sudo ufw allow 443/tcp

# Enable firewall (if not already enabled)
sudo ufw enable

# Check firewall status
sudo ufw status
```

### 7. Access Your Application

Open your browser and navigate to:

```
http://YOUR_SERVER_IP
```

## Automated Deployment with GitHub Actions

### Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy to Linux Server

on:
  push:
    branches: [main, master]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USERNAME }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /opt/HisMedFront
            git pull origin main
            docker compose down
            docker compose up -d --build
            docker image prune -f
```

### Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add the following secrets:
   - `SERVER_HOST`: Your server IP address
   - `SERVER_USERNAME`: SSH username (e.g., ubuntu)
   - `SERVER_SSH_KEY`: Your private SSH key

### Generate SSH Key for GitHub Actions

On your local machine:

```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github-actions

# Copy the public key to your server
ssh-copy-id -i ~/.ssh/github-actions.pub username@YOUR_SERVER_IP

# Display the private key (copy this to GitHub secrets)
cat ~/.ssh/github-actions
```

## Manual Deployment/Update Process

When you push changes to GitHub, follow these steps on your server:

```bash
# Navigate to project directory
cd /opt/HisMedFront

# Pull latest changes
git pull origin main

# Rebuild and restart containers
docker compose down
docker compose up -d --build

# Clean up unused images
docker image prune -f
```

## SSL/HTTPS Setup (Optional but Recommended)

### Using Let's Encrypt with Nginx

1. Install Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

2. Update `docker-compose.yml` to expose port 443:

```yaml
ports:
  - "80:80"
  - "443:443"
volumes:
  - ./nginx.conf:/etc/nginx/conf.d/default.conf
  - /etc/letsencrypt:/etc/letsencrypt:ro
```

3. Update `nginx.conf` for SSL:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

4. Obtain SSL certificate:

```bash
sudo certbot certonly --nginx -d yourdomain.com
```

## Useful Docker Commands

```bash
# View running containers
docker ps

# View all containers
docker ps -a

# View container logs
docker logs hismedfront

# Execute commands inside container
docker exec -it hismedfront sh

# View container resource usage
docker stats

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Complete cleanup
docker system prune -a
```

## Monitoring and Maintenance

### View Application Logs

```bash
docker compose logs -f hismedfront
```

### Check Container Health

```bash
docker ps
docker inspect hismedfront
```

### Update Application

```bash
cd /opt/HisMedFront
git pull
docker compose up -d --build
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 80
sudo lsof -i :80

# Kill the process
sudo kill -9 PID
```

### Container Won't Start

```bash
# Check logs
docker logs hismedfront

# Check if image built correctly
docker images

# Rebuild from scratch
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Permission Issues

```bash
# Fix ownership
sudo chown -R $USER:$USER /opt/HisMedFront

# Fix permissions
chmod -R 755 /opt/HisMedFront
```

## Production Considerations

1. **Use a reverse proxy** (Nginx/Traefik) for multiple applications
2. **Set up SSL/TLS** certificates for HTTPS
3. **Configure proper logging** and monitoring
4. **Set up automated backups** of your data
5. **Use environment variables** for sensitive configuration
6. **Implement health checks** in Docker
7. **Set up a CI/CD pipeline** for automated deployments
8. **Monitor resource usage** and scale as needed

## Support

For issues or questions, refer to:

- Angular Documentation: https://angular.io/docs
- Docker Documentation: https://docs.docker.com
- Nginx Documentation: https://nginx.org/en/docs
