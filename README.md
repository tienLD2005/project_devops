# ✨ TaskFlow - TodoList Application

A modern, feature-rich TodoList application built with **React + TypeScript + Vite**. Includes full CRUD operations, priority levels, due dates, and localStorage persistence.

## 🎯 Features

- ✅ **Full CRUD Operations** - Create, Read, Update, Delete todos
- 🎨 **Modern UI** - Beautiful gradient design with responsive layout
- 📋 **Smart Filtering** - All, Active, Completed + Search functionality
- ⚡ **Priority & Due Dates** - High/Medium/Low priorities with date tracking
- 💾 **LocalStorage** - Data persists across sessions
- 🐳 **Docker Ready** - Multi-stage build & Nginx server
- 🔄 **CI/CD** - GitHub Actions auto-deployment

## 🚀 Quick Start

```bash
npm install
npm run dev          # Dev server at http://localhost:5173
npm run build        # Production build
npm run preview      # Preview production build
```

## 📦 Docker (Local)

```bash
docker-compose up -d
# App at http://localhost:3000
```

## 🌐 Production Deployment

**No Docker Hub needed!** Simple SSH + build on server.

See [DEPLOY_SIMPLE.md](./DEPLOY_SIMPLE.md) for quick deployment guide.
