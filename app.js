import path from "path";
import express from "express";
import { v4 as uuid } from "uuid";
import { fileURLToPath } from "url";

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// In-memory store
let posts = [];

// --- Routes ---
app.get("/", (req, res) => {
  res.render("index", { posts });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) return res.redirect("/compose");

  const newPost = { id: uuid(), title, body, createdAt: new Date() };
  posts.unshift(newPost);

  res.redirect("/");
});

app.get("/edit/:id", (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).send("Post not found");
  res.render("edit", { post });
});

app.post("/edit/:id", (req, res) => {
  const { title, body } = req.body;
  posts = posts.map((p) =>
    p.id === req.params.id ? { ...p, title, body } : p
  );
  res.redirect("/");  
});

app.post("/delete/:id", (req, res) => {
  posts = posts.filter((p) => p.id !== req.params.id);
  res.redirect("/");
});

// --- Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});