import * as path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const express = require("express");
const app = express();
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const staticDirectory = path.resolve(currentDirectory, "..");
app.use(express.static(staticDirectory));
app.listen(8080, () => {
    console.log("Server running at http://localhost:8080");
});
