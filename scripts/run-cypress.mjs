import { spawn } from "node:child_process";

const spawnOptions = { stdio: "inherit" };
const server = process.platform === "win32"
  ? spawn(process.env.ComSpec ?? "cmd.exe", ["/d", "/s", "/c", "npm start"], spawnOptions)
  : spawn("npm", ["start"], spawnOptions);
let serverReady = false;

try {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch("http://localhost:8080/");
      if (response.ok) {
        serverReady = true;
        break;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  if (!serverReady) {
    throw new Error("Server did not start on port 8080.");
  }

  const cypress = process.platform === "win32"
    ? spawn(process.env.ComSpec ?? "cmd.exe", ["/d", "/s", "/c", "npx cypress run"], spawnOptions)
    : spawn("npx", ["cypress", "run"], spawnOptions);
  const exitCode = await new Promise((resolve) => {
    cypress.on("close", resolve);
  });
  process.exitCode = exitCode ?? 1;
} finally {
  server.kill();
}