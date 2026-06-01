import { spawn } from "node:child_process";

const isWindows = process.platform === "win32";

const commands = isWindows
  ? [
      [
        "frontend",
        "powershell.exe",
        ["-ExecutionPolicy", "Bypass", "-File", "./scripts/dev-frontend.ps1"],
      ],
      [
        "backend",
        "powershell.exe",
        ["-ExecutionPolicy", "Bypass", "-File", "./scripts/dev-backend.ps1"],
      ],
    ]
  : [
      ["frontend", "pnpm", ["--dir", "frontend", "dev"]],
      [
        "backend",
        "python",
        [
          "-m",
          "uvicorn",
          "app.main:app",
          "--app-dir",
          "backend",
          "--reload",
          "--host",
          "0.0.0.0",
          "--port",
          "8000",
        ],
      ],
    ];

const children = commands.map(([name, command, args]) => {
  const child = spawn(isWindows ? `${command}.cmd` : command, args, {
    stdio: "inherit",
    shell: false,
  });

  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`[${name}] exited with code ${code}`);
    }
  });

  return child;
});

const shutdown = () => {
  for (const child of children) {
    child.kill();
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
