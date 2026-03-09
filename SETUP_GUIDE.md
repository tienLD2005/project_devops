# 🎯 TaskFlow - Complete Setup Guide

## Tóm tắt những gì đã hoàn thành

### 1. ✅ Giao diện Frontend - Hoàn toàn mới & hiện đại

- **Sidebar Navigation** - Filter & stats trực quan
- **Card-based Design** - Todo items hiển thị dạng card đẹp mắt
- **Gradient Background** - Từ tím đến xanh lam
- **Responsive Layout** - Desktop, tablet, mobile
- **Smooth Animations** - Hover effects & transitions

### 2. ✅ CRUD Logic Đầy đủ

- **Create** - Thêm todo với priority & due date
- **Read** - Hiển thị danh sách với filter/search
- **Update** - Chỉnh sửa text todo (Edit mode)
- **Delete** - Xóa từng todo hoặc bulk delete completed

### 3. ✅ LocalStorage Integration

- Tự động lưu vào localStorage mỗi khi thay đổi
- Tự động load dữ liệu khi page refresh
- Fallback về sample data nếu localStorage empty

### 4. ✅ Docker Multi-stage Build

**Dockerfile**:

- Stage 1: Build với Node.js 20
- Stage 2: Serve với Nginx Alpine
- Security: Non-root user (nginx)
- Health checks

### 5. ✅ Nginx Configuration

- Gzip compression
- Cache headers cho static files (1 năm)
- Upload size limit (10MB)
- Security headers
- SPA routing (try_files)

### 6. ✅ Docker Compose

- Frontend service trên port 3000
- Network isolation
- Health checks
- Restart policy

### 7. ✅ CI/CD Pipeline (GitHub Actions)

```
Push to main/production
  → Build Docker image
  → Push to Docker Hub
  → SSH to server
  → Pull image & restart
  → Verify deployment
```

### 8. ✅ Documentation

- **README.md** - Project overview
- **DEPLOYMENT.md** - Step-by-step deployment guide
- **SETUP_GUIDE.md** - Hướng dẫn này

---

## 📁 Project Files Created

```
fe_app/
├── src/
│   ├── App.tsx ...................... Hoàn toàn mới với CRUD + Edit
│   ├── App.css ...................... Modern design, responsive
│   ├── main.tsx
│   ├── index.css
│   └── assets/
│
├── Dockerfile ....................... Multi-stage build
├── docker-compose.yml ............... Container orchestration
├── nginx.conf ....................... Proxy & compression config
├── .dockerignore .................... Exclude files from build
│
├── .github/
│   └── workflows/
│       └── deploy.yml ............... GitHub Actions CI/CD
│
├── README.md ........................ Project documentation
├── DEPLOYMENT.md .................... Deployment instructions
├── SETUP_GUIDE.md ................... This file
│
├── package.json (unchanged)
├── vite.config.ts (unchanged)
├── tsconfig.json (unchanged)
└── eslint.config.js (unchanged)
```

---

## 🚀 Local Development

### 1. Start dev server

```bash
cd /Users/mrbee/Desktop/fe_app
npm install
npm run dev
```

- Access at: `http://localhost:5173`
- Hot reload enabled
- TypeScript checking

### 2. Test features

- ✓ Add todo dengan priority + due date
- ✓ Edit todo bằng nút (✎)
- ✓ Mark complete bằng checkbox
- ✓ Delete individual todos
- ✓ Filter by All/Active/Completed
- ✓ Search todos
- ✓ "Clear completed" button
- ✓ Refresh page → data persists

### 3. Build production

```bash
npm run build
npm run preview
```

---

## 🐳 Local Docker Testing

### 1. Build image

```bash
cd /Users/mrbee/Desktop/fe_app
docker build -t taskflow:latest .
```

### 2. Run with Docker Compose

```bash
docker-compose up -d
```

### 3. Access & test

```bash
# Access application
curl http://localhost:3000

# View logs
docker-compose logs -f frontend

# Stop
docker-compose down
```

---

## 🌐 Production Deployment

### Phase 1: Server Setup (1-2 hours)

1. **SSH to server**

   ```bash
   ssh ubuntu@13.208.251.144
   ```

2. **Install Docker + Compose** (see DEPLOYMENT.md)

3. **Install Nginx**

   ```bash
   sudo apt install nginx -y
   ```

4. **Create SSH key for GitHub Actions** (see DEPLOYMENT.md)

### Phase 2: GitHub Setup (15 mins)

1. **Fork/Clone repo to your GitHub**
2. **Add 5 secrets** in Settings → Secrets:
   - `PROD_SERVER_IP`
   - `PROD_SERVER_USER`
   - `PROD_SERVER_SSH_KEY`
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`

### Phase 3: Deploy (5 mins)

```bash
# Push to main
git add .
git commit -m "Deploy TaskFlow"
git push origin main
```

GitHub Actions akan:

- Build image
- Push to Docker Hub
- Deploy to production
- Verify with health checks

### Phase 4: Verify

```bash
# Check on server
ssh ubuntu@13.208.251.144

# View status
docker-compose ps

# Check logs
docker-compose logs frontend

# Test endpoint
curl http://le-dien-tien.rikkeieducation.com
```

---

## 🔐 GitHub Secrets Needed

| Secret                | Example              |
| --------------------- | -------------------- |
| `PROD_SERVER_IP`      | `13.208.251.144`     |
| `PROD_SERVER_USER`    | `ubuntu`             |
| `PROD_SERVER_SSH_KEY` | _(private SSH key)_  |
| `DOCKER_USERNAME`     | `yourusername`       |
| `DOCKER_PASSWORD`     | _(Docker Hub token)_ |

---

## ⚙️ Customization

### Change colors

Edit `src/App.css` - Look for gradient colors:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Change domain

1. Edit `DEPLOYMENT.md` - Replace domain
2. Edit `.github/workflows/deploy.yml` - Update domain in verify step
3. Update Nginx config - `/etc/nginx/sites-available/taskflow.conf`

### Change port

- Docker: Edit `docker-compose.yml` → ports: `"3000:80"`
- Nginx: Edit `nginx.conf` → `listen 80;`

### Add backend API

1. Create backend service
2. Add to `docker-compose.yml`
3. Update Nginx config with `/api` proxy

---

## 📊 Monitoring

### View logs

```bash
ssh ubuntu@13.208.251.144
docker-compose logs -f frontend
```

### Check health

```bash
curl -i http://le-dien-tien.rikkeieducation.com
```

### Update code

```bash
cd ~/taskflow
git pull
docker-compose pull
docker-compose up -d
```

---

## 🐛 Troubleshooting

### Port 3000 already in use

```bash
sudo lsof -i :3000
kill -9 <PID>
```

### Docker image build fails

```bash
docker system prune -a
docker build -t taskflow:latest . --no-cache
```

### GitHub Actions not deploy

1. Check SSH key is correct
2. Verify secrets in Settings
3. Check Actions tab for error logs

### App not accessible via domain

1. Check DNS A record points to server IP
2. Verify Nginx config: `sudo nginx -t`
3. Check Nginx running: `sudo systemctl status nginx`
4. Check container running: `docker ps`

---

## ✅ Deployment Checklist

- [ ] Local dev works (`npm run dev`)
- [ ] Local Docker works (`docker-compose up -d`)
- [ ] Server has Docker + Compose installed
- [ ] SSH key created for GitHub Actions
- [ ] 5 GitHub Secrets added
- [ ] Nginx installed on server
- [ ] DNS A record configured
- [ ] Code pushed to main branch
- [ ] GitHub Actions workflow succeeded
- [ ] App accessible via domain
- [ ] Data persists after refresh

---

## 📞 Next Steps

1. **Test locally** - Make sure everything works on dev
2. **Setup server** - Follow DEPLOYMENT.md Phase 1
3. **Configure GitHub** - Add secrets & enable Actions
4. **Deploy** - Push to main, GitHub Actions handles rest
5. **Verify** - Test via domain URL
6. **Monitor** - Check logs regularly

---

**Happy Deploying! 🚀**
