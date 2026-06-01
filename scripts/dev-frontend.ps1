$ErrorActionPreference = "Stop"

$bundledNode = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if (Test-Path $bundledNode) {
  $nodePath = $bundledNode
} else {
  $node = Get-Command node -ErrorAction SilentlyContinue
  if (-not $node) {
    throw "Node.js 22+ is required. Install Node.js or add it to PATH."
  }
  $nodePath = $node.Source
}

$logDir = Join-Path $PSScriptRoot "..\logs\frontend"
New-Item -ItemType Directory -Force $logDir | Out-Null
$logFile = Join-Path $logDir "dev.log"

Push-Location (Join-Path $PSScriptRoot "..\frontend")
try {
  Start-Transcript -Path $logFile -Append | Out-Null
  try {
    & $nodePath .\node_modules\next\dist\bin\next dev --hostname 0.0.0.0 --port 3000
  } finally {
    Stop-Transcript | Out-Null
  }
} finally {
  Pop-Location
}
