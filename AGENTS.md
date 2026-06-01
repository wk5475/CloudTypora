# AGENTS.md

# 项目名称

Cloud Markdown Note System

---

# 一、项目目标

本项目旨在开发一个：

* 类似 Typora 的 Markdown 编辑器
* 支持云同步
* 支持在线编辑
* 支持多设备访问
* 支持本地缓存
* 支持离线恢复

的现代化笔记系统。

核心目标：

> 提供接近 Typora 的沉浸式写作体验，同时具备云端同步能力。

---

# 二、技术栈规范

# 前端

| 技术                 | 要求           |
| ------------------ | ------------ |
| React              | 必须           |
| Next.js App Router | 必须           |
| TypeScript         | 必须           |
| TailwindCSS        | 必须           |
| Zustand            | 全局状态         |
| Milkdown           | Markdown 编辑器 |
| Yjs                | 实时同步         |
| IndexedDB          | 本地缓存         |

---

# 后端

| 技术             | 要求     |
| -------------- | ------ |
| Python 3.12+   | 必须     |
| FastAPI        | API 框架 |
| SQLAlchemy 2.0 | ORM    |
| PostgreSQL     | 主数据库   |
| Redis          | 缓存     |
| WebSocket      | 实时同步   |
| MinIO/S3       | 文件存储   |

---

# 部署

| 技术             | 用途    |
| -------------- | ----- |
| Docker         | 容器化   |
| Docker Compose | 本地开发  |
| Nginx          | 网关    |
| GitHub Actions | CI/CD |

---

# 三、开发原则

# 1. 编辑器体验优先

所有功能必须：

* 不影响输入流畅度
* 不阻塞主线程
* 保持低延迟

禁止：

* 输入时频繁 re-render
* 大量同步 setState
* 重型 DOM 操作

目标：

> 编辑器输入延迟 < 16ms

---

# 2. Markdown First

系统核心数据格式：

```md
# Title

content...
```

禁止：

* 使用 proprietary 富文本格式
* 将 HTML 作为主存储结构

Markdown 是唯一可信源。

---

# 3. Offline First

系统必须支持：

* 网络断开后继续编辑
* 自动恢复
* 自动同步

所有编辑操作：

必须优先写入本地缓存。

---

# 4. Incremental Sync

禁止：

* 每次保存整篇文档

必须：

* 增量同步
* Patch 同步
* CRDT 合并

---

# 5. 极简架构

避免：

* 过度微服务
* 复杂 DDD
* 无意义抽象

优先：

* 可维护
* 可快速开发
* 清晰目录结构

---

# 四、前端目录规范

```text
frontend/
├── app/
├── components/
├── editor/
├── hooks/
├── lib/
├── services/
├── stores/
├── styles/
├── types/
└── utils/
```

---

# 五、后端目录规范

```text
backend/
├── app/
│   ├── api/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── websocket/
│   ├── storage/
│   ├── sync/
│   ├── core/
│   └── utils/
├── tests/
└── alembic/
```

---

# 六、代码规范

# TypeScript

必须：

* strict mode
* 明确类型
* 禁止 any

禁止：

```ts
const data: any
```

优先：

```ts
interface DocumentItem {
  id: string
  title: string
}
```

---

# Python

必须：

* 类型注解
* Pydantic schema
* Ruff lint

函数必须：

```python
def create_document(
    user_id: str,
    title: str,
) -> Document:
```

禁止：

* 无类型函数
* 巨型 service 文件

---

# 七、编辑器规范

# 编辑器核心原则

编辑器模块必须独立：

```text
/editor
```

禁止：

* 业务逻辑污染编辑器
* 编辑器依赖页面状态

---

# 编辑器功能拆分

```text
editor/
├── plugins/
├── commands/
├── shortcuts/
├── markdown/
├── sync/
└── components/
```

---

# 八、同步系统规范

# 同步优先级

同步系统是项目核心。

必须：

* 使用 Yjs
* 使用 WebSocket
* 支持 reconnect
* 支持冲突恢复

---

# 数据同步流程

```text
用户输入
↓
本地状态更新
↓
IndexedDB 持久化
↓
Yjs document 更新
↓
WebSocket 同步
↓
服务端广播
```

---

# 九、数据库规范

# PostgreSQL

禁止：

* 无索引查询
* 大字段频繁扫描

必须：

* created_at
* updated_at

---

# 文档表设计

```sql
documents
```

字段：

* id
* user_id
* title
* content
* content_snapshot
* created_at
* updated_at

---

# 十、性能要求

# 编辑器

目标：

| 指标   | 要求     |
| ---- | ------ |
| 输入延迟 | <16ms  |
| 打开文档 | <2s    |
| 自动保存 | <500ms |

---

# 前端

必须：

* React memo
* 虚拟列表
* 懒加载

禁止：

* 无限制渲染
* 巨型 context

---

# 十一、安全要求

# 必须

* HTTPS
* JWT Auth
* Refresh Token
* XSS 防御
* SQL 注入防御

---

# 文件上传

必须：

* 文件类型校验
* 文件大小限制
* 随机文件名

禁止：

* 用户原始文件名直接存储

---

# 十二、AI Agent 开发规范

# Agent 输出要求

生成代码时：

必须：

* 可运行
* 类型完整
* 带错误处理
* 带注释

禁止：

* demo 级伪代码
* TODO 占位
* 未完成函数

---

# 修改代码时

禁止：

* 重写整个文件
* 修改无关逻辑

必须：

* 最小修改
* 保持兼容

---

# API 开发规范

必须：

* RESTful
* 明确 response schema

返回格式：

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

---

# 十三、Git 规范

# Commit 规范

```text
feat:
fix:
refactor:
docs:
style:
test:
```

示例：

```text
feat(editor): add markdown image upload
```

---

# 分支规范

```text
main
develop
feature/*
fix/*
```

---

# 十四、MVP 范围

第一阶段只允许开发：

# 必须功能

* 用户登录
* Markdown 编辑
* 自动保存
* 文件夹
* 云同步
* 图片上传

---

# 禁止提前开发

* AI
* 插件系统
* 团队协作
* 知识图谱
* 双链系统

---

# 十五、未来扩展方向

后续允许扩展：

* AI 助手
* 向量检索
* OCR
* 双链
* 图谱
* Tauri 客户端

但：

> 不允许破坏 Markdown First 架构。

---

# 十六、最终原则

本项目最重要的目标：

# 不是功能数量

而是：

* 写作体验
* 稳定同步
* 数据安全
* 长期可靠

所有开发决策必须优先考虑：

```text
编辑体验 > 功能数量
同步稳定 > 炫酷功能
```
