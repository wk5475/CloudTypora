$ErrorActionPreference = "Stop"

$python = Join-Path $PSScriptRoot "..\.venv\Scripts\python.exe"
if (-not (Test-Path $python)) {
  throw "缺少后端虚拟环境。请先执行：python -m venv .venv; .\.venv\Scripts\python.exe -m pip install -e `"backend[dev]`""
}

$logDir = Join-Path $PSScriptRoot "..\logs\backend"
New-Item -ItemType Directory -Force $logDir | Out-Null
$logFile = Join-Path $logDir "dev.log"

Start-Transcript -Path $logFile -Append | Out-Null
try {
  & $python -m uvicorn app.main:app --app-dir backend --reload --host 0.0.0.0 --port 8000
} finally {
  Stop-Transcript | Out-Null
}
