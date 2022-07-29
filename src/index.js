const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const userData = users.find((user) => user.username === username);

  if (!userData) {
    return response.status(400).json({ error: `User "${username}" not found` });
  }

  request.userData = userData;
  next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;
  const userAlreadyExists = users.some((user) => user.username === username);

  if (userAlreadyExists) {
    return response
      .status(400)
      .json({ error: `User "${username}" already exists` });
  }

  const newUserData = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(newUserData);
  response.json(newUserData);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { todos } = request.userData;

  return response.json(todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { todos } = request.userData;
  const { title, deadline } = request.body;
  const newTodoData = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  todos.push(newTodoData);
  response.status(201).json(newTodoData);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
