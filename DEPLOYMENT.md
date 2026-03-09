# TaskFlow - Hướng dẫn Deployment

## 📋 Mục lục

1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Setup Server](#setup-server)
3. [Cấu hình GitHub Actions](#cấu-hình-github-actions)
4. [Cấu hình Domain & Nginx](#cấu-hình-domain--nginx)
5. [Deploying](#deploying)
6. [Monitoring & Troubleshooting](#monitoring--troubleshooting)

---

## 🔧 Yêu cầu hệ thống

- **Server**: Ubuntu 20.04+ (IP: 13.208.251.144)
- **User**: ubuntu
- **Domain**: le-dien-tien.rikkeieducation.com
- **Software**: Docker, Docker Compose, Nginx

---

## 🏗️ Setup Server

### 1. Kết nối SSH đến server

```bash
ssh ubuntu@13.208.251.144
```

### 2. Cập nhật hệ thống

```bash
sudo apt update
sudo apt upgrade -y
```

### 3. Cài đặt Docker

```bash
# Cài Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Thêm user vào docker group
sudo usermod -aG docker ubuntu

# Đăng xuất, đăng nhập lại
exit
ssh ubuntu@13.208.251.144
```

### 4. Cài đặt Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

### 5. Cài đặt Nginx

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 🔐 Cấu hình GitHub Actions

### 1. Tạo SSH Key

```bash
# Trên server
ssh-keygen -t ed25519 -f ~/.ssh/github_actions -N ""
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Hiển thị private key
cat ~/.ssh/github_actions
```

### 2. Thêm Secrets vào GitHub

UI: Repo → Settings → Secrets and variables → Actions → New repository secret

**Thêm các secrets sau:**

| Secret Name           | Value                         |
| --------------------- | ----------------------------- |
| `PROD_SERVER_IP`      | `13.208.251.144`              |
| `PROD_SERVER_USER`    | `ubuntu`                      |
| `PROD_SERVER_SSH_KEY` | _(Nội dung SSH private key)_  |
| `DOCKER_USERNAME`     | _(Docker Hub username)_       |
| `DOCKER_PASSWORD`     | _(Docker Hub password/token)_ |

---

## 🌐 Cấu hình Domain & Nginx

### 1. Cấu hình Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/taskflow.conf
```

**Nội dung:**

```nginx
server {
    listen 80;
    server_name le-dien-tien.rikkeieducation.com;

    # Redirect HTTP to HTTPS (nếu có SSL)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Gzip
        gzip on;
        gzip_types text/plain text/css text/javascript application/json;
        client_max_body_size 10M;
    }
}
```

### 2. Enable site

```bash
sudo ln -s /etc/nginx/sites-available/taskflow.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Cấu hình DNS

Yêu cầu admin cấu hình DNS record:

```
A record: le-dien-tien.rikkeieducation.com → 13.208.251.144
```

---

## 🚀 Deploying

### 1. Clone Repository (lần đầu tiên)

```bash
cd ~
mkdir -p taskflow
cd taskflow
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .
```

### 2. Setup `.env` (nếu cần)

```bash
cat > .env << EOF
NODE_ENV=production
EOF
```

### 3. Deploy Manual (nếu cần)

```bash
# Pull latest code
git pull

# Build và start containers
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f frontend
```

### 4. Auto Deployment via GitHub Actions

- Push code lên branch `main` hoặc `production`
- GitHub Actions sẽ:
  1. Build Docker image
  2. Push lên Docker Hub
  3. SSH vào server production
  4. Pull image và restart containers
  5. Verify deployment

---

## 📊 Monitoring & Troubleshooting

### 1. Kiểm tra status

```bash
# Container status
docker-compose ps

# Logs
docker-compose logs frontend

# Real-time logs
docker-compose logs -f frontend --tail=50
```

### 2. Restart services

```bash
# Restart one service
docker-compose restart frontend

# Restart all
docker-compose restart

# Stop all
docker-compose down

# Start all
docker-compose up -d
```

### 3. Update version

```bash
cd ~/taskflow

# Pull latest code
git pull

# Pull latest image
docker-compose pull

# Restart
docker-compose up -d
```

### 4. View disk usage

```bash
docker system df
docker system prune -a --volumes  # Xóa unused images/containers (cẩn thận!)
```

### 5. Kiểm tra endpoint

```bash
# Check if app is running
curl http://localhost:3000

# Check through domain
curl http://le-dien-tien.rikkeieducation.com

# Check Nginx
curl -I http://le-dien-tien.rikkeieducation.com
```

### 6. SSL/TLS Setup (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Create certificate
sudo certbot certonly --nginx -d le-dien-tien.rikkeieducation.com

# Configure Nginx for SSL
sudo nano /etc/nginx/sites-available/taskflow.conf
```

**Thêm như sau:**

```nginx
server {
    listen 443 ssl http2;
    server_name le-dien-tien.rikkeieducation.com;

    ssl_certificate /etc/letsencrypt/live/le-dien-tien.rikkeieducation.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/le-dien-tien.rikkeieducation.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        # ... rest of proxy config
    }
}

server {
    listen 80;
    server_name le-dien-tien.rikkeieducation.com;
    return 301 https://$server_name$request_uri;
}
```

```bash
sudo systemctl reload nginx
```

---

## 📝 Useful Commands

```bash
# SSH to server
ssh ubuntu@13.208.251.144

# Check app is running
docker exec taskflow_fe nginx -v

# View running processes
docker ps

# Remove container
docker stop taskflow_fe && docker rm taskflow_fe

# Clear all Docker data
docker system prune -a --volumes

# Check port usage
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :80

# Check disk space
df -h

# Check memory usage
free -h
```

---

## 🔗 Truy cập ứng dụng

**URL**: http://le-dien-tien.rikkeieducation.com

---

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:

1. Docker logs: `docker-compose logs frontend`
2. Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. System logs: `sudo journalctl -e`
