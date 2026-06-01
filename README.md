# CloudTypora

CloudTypora 是一个面向写作体验的云端 Markdown 笔记系统。项目目标是提供接近 Typora 的沉浸式编辑体验，同时支持云同步、多设备访问、本地缓存和离线恢复。

## 当前进度

已完成基础项目初始化：

- 前端：Next.js App Router、React、TypeScript、TailwindCSS、Zustand。
- 编辑器：已建立独立 `frontend/editor` 模块，预留 Milkdown、Yjs、IndexedDB 同步能力。
- 后端：FastAPI、SQLAlchemy 2.0、Pydantic schema、统一 API 响应格式。
- 同步：已创建 WebSocket 同步入口。
- 基础页面：登录页、笔记工作台、Markdown 编辑区域。
- 开发环境：Docker Compose、环境变量样例、GitHub Actions、前后端开发脚本。
- 日志目录：前端日志写入 `logs/frontend/dev.log`，后端日志写入 `logs/backend/dev.log`。

## 技术栈

### 前端

- React
- Next.js App Router
- TypeScript
- TailwindCSS
- Zustand
- Milkdown
- Yjs
- IndexedDB

### 后端

- Python 3.12+
- FastAPI
- SQLAlchemy 2.0
- PostgreSQL
- Redis
- WebSocket
- MinIO / S3

### 开发与部署

- Docker
- Docker Compose
- GitHub Actions

## 目录结构

```text
CloudTypora/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── editor/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── stores/
│   ├── styles/
│   ├── types/
│   └── utils/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── websocket/
│   │   ├── storage/
│   │   ├── sync/
│   │   ├── core/
│   │   └── utils/
│   ├── tests/
│   └── alembic/
├── logs/
│   ├── frontend/
│   └── backend/
├── scripts/
├── docker-compose.yml
└── .env.example
```

## 本地启动

### 1. 准备环境变量

复制环境变量样例：

```powershell
Copy-Item .env.example .env
```

### 2. 启动基础服务

```powershell
docker compose up -d
```

这会启动 PostgreSQL、Redis 和 MinIO。

### 3. 安装后端依赖

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e "backend[dev]"
```

### 4. 安装前端依赖

```powershell
pnpm --dir frontend install
```

如果本机没有 pnpm，可以先安装 pnpm，或使用 Node.js 自带的 Corepack 启用 pnpm。

### 5. 启动后端

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\dev-backend.ps1
```

后端地址：

```text
http://127.0.0.1:8000/api/v1/health
```

### 6. 启动前端

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\dev-frontend.ps1
```

前端地址：

```text
http://127.0.0.1:3000/notes
```

## 日志

开发脚本会自动创建日志目录：

```text
logs/
├── backend/
│   └── dev.log
└── frontend/
    └── dev.log
```

日志文件用于排查本地开发启动问题，不建议提交运行时生成的 `.log` 文件。

## 常用命令

### 后端测试

```powershell
.\.venv\Scripts\python.exe -m pytest backend\tests
```

### 后端代码检查

```powershell
.\.venv\Scripts\python.exe -m ruff check backend
```

### 前端类型检查

```powershell
pnpm --dir frontend typecheck
```

## API 响应格式

后端统一返回：

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

## 当前页面

- `/login`：登录页框架。
- `/notes`：笔记工作台，包含侧边栏、搜索入口、上传入口和 Markdown 编辑区域。
- `/`：自动跳转到 `/notes`。

## 开发原则

- 编辑体验优先。
- Markdown 是唯一可信源。
- 本地缓存优先，网络恢复后同步。
- 使用 Yjs 和 WebSocket 做增量同步基础。
- MVP 阶段只聚焦登录、Markdown 编辑、自动保存、文件夹、云同步和图片上传。
