# 🚀 TaskFlow - Simple Deployment Guide

**Cách deploy này đơn giản hơn vì không cần Docker Hub!**

---

## 📋 Thông tin Server

```
IP: 13.208.251.144
User: ubuntu
Domain: le-dien-tien.rikkeieducation.com
```

---

## 🎯 5 Bước Deployment

### **Bước 1️⃣ - SSH vào Server**

```bash
ssh ubuntu@13.208.251.144
```

---

### **Bước 2️⃣ - Cài đặt môi trường trên Server**

```bash
# Update system
sudo apt update
sudo apt install docker.io nginx git -y

# Start services
sudo systemctl start docker
sudo systemctl start nginx
sudo systemctl enable docker
sudo systemctl enable nginx

# Add ubuntu to docker group (để không cần sudo)
sudo usermod -aG docker ubuntu

# Log out & back in
exit
ssh ubuntu@13.208.251.144
```

Verify:

```bash
docker --version
nginx -v
```

---

### **Bước 3️⃣ - Clone Project lên Server**

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git ~/app
cd ~/app

# Verify files
ls -la
```

---

### **Bước 4️⃣ - Cấu hình Nginx Reverse Proxy**

Tạo config file:

```bash
sudo nano /etc/nginx/sites-available/taskflow
```

**Copy & paste nội dung này:**

```nginx
server {
    listen 80;
    server_name le-dien-tien.rikkeieducation.com;

    # Enable gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss;
    gzip_min_length 1000;

    # Client max body size
    client_max_body_size 10M;

    # Proxy configuration
    location / {
        proxy_pass http://localhost:3004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Save**: `Ctrl+X` → `Y` → `Enter`

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/taskflow /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default 2>/dev/null || true
sudo nginx -t
sudo systemctl restart nginx
```

---

### **Bước 5️⃣ - Setup GitHub Secrets**

**Tạo SSH Key trên Server:**

```bash
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -N ""
cat ~/.ssh/github_deploy
```

Copy output (từ `-----BEGIN` đến `-----END`)

**Trên GitHub (Settings → Secrets → Actions):**

Tạo 2 secrets:

| Secret Name           | Value                                |
| --------------------- | ------------------------------------ |
| `PROD_SERVER_IP`      | `13.208.251.144`                     |
| `PROD_SERVER_USER`    | `ubuntu`                             |
| `PROD_SERVER_SSH_KEY` | _Paste SSH private key từ bước trên_ |

---

## 🚀 Deploy Lần Đầu (Manual)

**Trên Server:**

```bash
cd ~/app

# Build Docker image
docker build -t taskflow-app:latest .

# Run container
docker run -d \
  --name taskflow-app \
  -p 3004:80 \
  --restart unless-stopped \
  taskflow-app:latest

# Check status
docker ps

# View logs
docker logs -f taskflow-app
```

**Test:**

```bash
# Local test
curl http://localhost:3004

# From anywhere
curl http://le-dien-tien.rikkeieducation.com
```

---

## 🔄 Deploy Lần Sau (GitHub Actions)

**Lưu ý: GitHub Actions CI/CD đã cấu hình sẵn**

**Flow:**

1. Developer push code lên `main` branch
2. GitHub Actions trigger
3. SSH vào server
4. Git pull code
5. Docker build image
6. Stop/remove old container
7. Run new container
8. Verify deployment

**Để trigger:**

```bash
cd ~/YOUR_PROJECT
git push origin main
```

**Monitor deployment:**

- GitHub → Actions tab → Check status
- Or SSH to server & check: `docker ps`

---

## 📊 Useful Commands

### Check status

```bash
ssh ubuntu@13.208.251.144
docker ps                          # List containers
docker logs taskflow-app           # View logs (last lines)
docker logs -f taskflow-app        # Real-time logs
```

### Stop/restart

```bash
docker stop taskflow-app
docker start taskflow-app
docker restart taskflow-app
```

### Rebuild & restart (after git pull)

```bash
cd ~/app
docker stop taskflow-app || true
docker rm taskflow-app || true
docker build -t taskflow-app:latest .
docker run -d --name taskflow-app -p 3004:80 --restart unless-stopped taskflow-app:latest
```

### Clean old images

```bash
docker system prune -a
```

### Check Nginx

```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

---

## ✅ Verification Checklist

- [ ] Can SSH to server
- [ ] Docker installed & running
- [ ] Nginx installed & running
- [ ] GitHub repo cloned at ~/app
- [ ] Nginx config created
- [ ] GitHub secrets added (2)
- [ ] First manual deployment successful
- [ ] App accessible at domain
- [ ] Can see logs with `docker logs`

---

## 🆘 Troubleshooting

### Docker build fails

```bash
cd ~/app
docker system prune -a
docker build -t taskflow-app:latest . --no-cache
```

### Port 3004 already in use

```bash
sudo netstat -tulpn | grep :3004
kill -9 <PID>
```

### Nginx not proxying

```bash
# Check nginx syntax
sudo nginx -t

# Check if nginx running
sudo systemctl status nginx

# Restart
sudo systemctl restart nginx

# Check proxy
curl http://localhost:3004
curl http://le-dien-tien.rikkeieducation.com
```

### Container keeps crashing

```bash
docker logs taskflow-app    # See error message
docker run -it taskflow-app /bin/sh  # Debug
```

### GitHub Actions failing

1. Check server IP is reachable: `ping 13.208.251.144`
2. Check SSH key format is correct
3. Check GitHub secrets are exactly named right
4. View Actions tab logs for details

---

## 🔐 Security Notes

✅ SSH key authentication (no password)
✅ nginx running on port 80
✅ Docker container on port 3004 (not exposed)
✅ GitHub secrets (not in code)

---

## 📈 Architecture

```
Developer Computer
    ↓ git push
GitHub Repository
    ↓ GitHub Actions triggered
GitHub Actions
    ↓ SSH deploy script
Server (13.208.251.144)
    ├─ Nginx (port 80)
    │  ├─ Proxy: le-dien-tien.rikkeieducation.com
    │  └─ Forward to: localhost:3004
    │
    └─ Docker Container (port 3004)
       ├─ Nginx inside (port 80 in container)
       └─ React app files
           ↓
        Browser
```

---

## 🎯 Timeline

| Step                 | Time       | Done   |
| -------------------- | ---------- | ------ |
| SSH & install        | 10 min     | ☐      |
| Clone project        | 2 min      | ☐      |
| Configure Nginx      | 5 min      | ☐      |
| Setup GitHub secrets | 5 min      | ☐      |
| Manual deploy        | 5 min      | ☐      |
| Test domain          | 2 min      | ☐      |
| **Total**            | **29 min** | **🎉** |

---

## 🚀 First Deploy Checklist

On Server:

```bash
✓ SSH to server
✓ Install Docker & Nginx
✓ Configure Nginx
✓ Clone project
✓ Build image: docker build -t taskflow-app:latest .
✓ Run container: docker run -d --name taskflow-app -p 3004:80 taskflow-app:latest
✓ Test: curl http://localhost:3004
✓ Test: curl http://le-dien-tien.rikkeieducation.com (or browser)
```

On GitHub:

```bash
✓ Add 3 secrets
✓ Push code to main branch
✓ Watch Actions tab
✓ Wait for deployment to complete
```

---

## 📝 Manual Deployment Script

Save this as `deploy.sh` on server for quick redeployment:

```bash
#!/bin/bash

cd ~/app
git pull origin main
docker stop taskflow-app || true
docker rm taskflow-app || true
docker build -t taskflow-app:latest .
docker run -d \
  --name taskflow-app \
  -p 3004:80 \
  --restart unless-stopped \
  taskflow-app:latest

echo "✅ Deployment complete!"
docker ps
```

Use:

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🎁 Next Steps

1. ✅ Follow steps 1-5 above
2. ✅ Test deployment works
3. ✅ Push code to GitHub
4. ✅ Watch it auto-deploy via Actions
5. ✅ Share domain with team

---

## 📞 Support

- Stuck? Check troubleshooting section
- Still stuck? Check Docker/Nginx logs
- Still stuck? SSH to server and check manually

---

**Quá đơn giản phải không? 🎉**

**Đi nào**: `ssh ubuntu@13.208.251.144`
