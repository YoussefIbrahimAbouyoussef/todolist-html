const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://youssefibrahim5238:YoussefIbrahim@cluster0.hfkkuai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

// Simple Schema: name + isChecked
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.model("Todo", todoSchema);

// Add new todo
app.post("/todos", async (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.text,
      completed: req.body.completed,
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/todos/fulldata", async (req, res) => {
  try {
    const todos = await Todo.find({});
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/todos/editname", async (req, res) => {
  try {
    const { newName, id } = req.body;

    const todo = await Todo.findByIdAndUpdate(
      id,
      { text: newName },
      { new: true }
    );
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/todos/checkbox", async (req, res) => {
  try {
    const { id, completed } = req.body;
    const todo = await Todo.findByIdAndUpdate(id, { completed }, { new: true });
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/todos/remove", async (req, res) => {
  try {
    const { id } = req.body;
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);
