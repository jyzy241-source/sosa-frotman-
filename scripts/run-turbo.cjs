const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const binDir = path.join(root, "node_modules", ".bin");
const turboBin = path.join(root, "node_modules", "turbo", "bin", "turbo");
const task = process.argv[2];

if (!task) {
  console.error("Uso: node scripts/run-turbo.cjs <dev|build|lint|test|typecheck>");
  process.exit(1);
}
if (!fs.existsSync(turboBin)) {
  console.error("No se encontró Turbo local. Ejecuta npm install para restaurar las dependencias.");
  process.exit(1);
}

const result = spawnSync(process.execPath, [turboBin, "run", task, ...process.argv.slice(3)], {
  cwd: root,
  env: { ...process.env, PATH: `${binDir}${path.delimiter}${process.env.PATH || ""}` },
  stdio: "inherit",
});

if (result.error) console.error(result.error.message);
if (result.status === null) console.error("Turbo no pudo iniciar. Revisa Node y los permisos del proyecto.");
process.exit(result.status ?? 1);
