import http from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import { parse } from "node:querystring";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataPath = resolve(__dirname, "../database/data.json");

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  if (method === "GET" && url === "/users") {
    const data = await readFile(dataPath, "utf-8");
    return res.setHeader("Content-type", "application/json").end(data);
  }

  if (method === "POST" && url === "/users") {
    const data = await readFile(dataPath, "utf-8");
    const users = JSON.parse(data);
    const newId =
      users.length > 0 ? Math.max(...users.map((item) => item.id)) + 1 : 1;

    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      const result = parse(body);
      const newItem = { id: newId, ...result };

      users.push(newItem);
      await writeFile(dataPath, JSON.stringify(users));
    });

    return res.writeHead(201).end();
  }

  res.writeHead(404).end("Not found");
});

server.listen(8080, () => {
  console.log("Server listening on port :8080");
});
