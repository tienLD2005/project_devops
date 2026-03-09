# 🚀 TaskFlow Quick Start

## Điều bạn vừa nhận được

Một TodoList application **hoàn toàn mới** với:

- ✨ Modern UI (gradient, sidebar, cards)
- ⚙️ Full CRUD + localStorage
- 🐳 Docker + Nginx + GitHub Actions
- 📦 Production-ready setup

---

## 🎯 3 Bước chính

### 1️⃣ Test Locally (5 mins)

```bash
cd /Users/mrbee/Desktop/fe_app

# Start dev server
npm install
npm run dev
```

**Truy cập**: `http://localhost:5173`

**Test features**:

- Thêm todo với priority + due date
- Edit bằng nút ✎
- Delete bằng nút 🗑️
- Filter: All/Active/Completed
- Search todos
- Refresh page → data vẫn còn ✓

---

### 2️⃣ Setup Production Server (30 minutes)

**Follow [DEPLOY_SIMPLE.md](./DEPLOY_SIMPLE.md) - Steps 1️⃣ to 5️⃣**

**Quick guide:**

```bash
# SSH to server
ssh ubuntu@13.208.251.144

# Install Docker + Nginx
sudo apt update
sudo apt install docker.io nginx git -y
sudo systemctl start docker
sudo systemctl start nginx
sudo usermod -aG docker ubuntu

# Clone project
git clone https://github.com/YOUR_USERNAME/taskflow.git ~/app

# Configure Nginx (see DEPLOY_SIMPLE.md step 4)
# Setup GitHub secrets (see DEPLOY_SIMPLE.md step 5)
```

**GitHub Secrets (2):**

```
PROD_SERVER_IP      = 13.208.251.144
PROD_SERVER_USER    = ubuntu
PROD_SERVER_SSH_KEY = (your SSH private key)
```

**First manual deploy:**

```bash
ssh ubuntu@13.208.251.144
cd ~/app
docker build -t taskflow-app:latest .
docker run -d --name taskflow-app -p 3004:80 --restart unless-stopped taskflow-app:latest
```

---

### 3️⃣ Deploy với GitHub Actions

```bash
cd /Users/mrbee/Desktop/fe_app

# Initialize git
git init
git add .
git commit -m "Deploy TaskFlow"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/taskflow.git
git push -u origin main
```

**GitHub Actions will automatically:**

1. Detect push to main
2. SSH to server
3. Git pull
4. Build Docker
5. Deploy
6. Verify

**Visit**: `http://le-dien-tien.rikkeieducation.com`

---

## 📁 Key Files

| File                           | Purpose                          |
| ------------------------------ | -------------------------------- |
| `src/App.tsx`                  | Modern React component with CRUD |
| `src/App.css`                  | Beautiful gradient design        |
| `Dockerfile`                   | Multi-stage build (Node → Nginx) |
| `docker-compose.yml`           | Container orchestration          |
| `nginx.conf`                   | Proxy & compression config       |
| `.github/workflows/deploy.yml` | Auto CI/CD pipeline              |

---

## 🎨 Customization

### Change colors

Edit `src/App.css`:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Change domain

Edit `DEPLOYMENT.md` and `nginx.conf` to replace:

```
le-dien-tien.rikkeieducation.com
```

### Add more features

- Add categories/tags
- Add reminders/notifications
- Add dark mode
- Add multi-user support

---

## 📊 Architecture

```
┌─────────────────────────────────────┐
│  Your Computer                       │
│  (npm run dev)                       │
│  http://localhost:5173              │
└────────────────┬────────────────────┘
                 │
                 │ git push
                 ↓
┌─────────────────────────────────────┐
│  GitHub                             │
│  (Actions CI/CD)                    │
│  - Build Docker image               │
│  - Push to Docker Hub               │
│  - Deploy to server                 │
└────────────────┬────────────────────┘
                 │
                 │ SSH deploy
                 ↓
┌─────────────────────────────────────┐
│  Ubuntu Server (13.208.251.144)    │
│  ├─ Nginx (Reverse Proxy)           │
│  │  ├─ Compress, Cache, Headers    │
│  │  └─ Forward :80 → :3000         │
│  ├─ Docker                          │
│  │  └─ TaskFlow Frontend Container  │
│  │     ├─ Node build               │
│  │     └─ Nginx serve              │
│  └─ DNS                             │
│     └─ le-dien-tien.rikkei...      │
└─────────────────────────────────────┘
         ↓
    http://le-dien-tien.rikkeieducation.com
```

---

## ✅ Checklist

- [ ] Tested locally (`npm run dev`)
- [ ] Docker tested (`docker-compose up`)
- [ ] Server has Docker installed
- [ ] SSH key created for GitHub
- [ ] GitHub secrets added
- [ ] Code pushed to GitHub main branch
- [ ] GitHub Actions succeeded (check Actions tab)
- [ ] DNS A record configured
- [ ] App accessible via domain
- [ ] Data persists after refresh

---

## 🆘 Quick Troubleshooting

**App won't start locally**

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Docker build fails**

```bash
docker system prune -a
docker build -t taskflow:latest . --no-cache
docker-compose up -d
```

**GitHub Actions fails**

- Check SSH key is correct format
- Check server IP is reachable
- View detailed logs in GitHub Actions tab

**App not accessible via domain**

- Check DNS A record: `nslookup le-dien-tien.rikkeieducation.com`
- Check Nginx running: `sudo systemctl status nginx`
- Check container running: `docker ps`

---

## 📖 Full Documentation

- **[README.md](./README.md)** - Project overview & features
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Detailed deployment guide
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup explanation

---

## 🎁 What's Next?

1. **Deploy it!** - Follow 3 steps above
2. **Customize it** - Change colors, domain, features
3. **Share it** - Show friends/colleagues
4. **Scale it** - Add backend, database, auth
5. **Monitor it** - Watch logs, fix bugs

---

**Ready? Start with**:

```bash
npm run dev
```

**Questions? Check**:

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment help
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Technical details
- GitHub Actions tab - CI/CD logs

---

**Made with ❤️ | Happy Shipping! 🚀**
