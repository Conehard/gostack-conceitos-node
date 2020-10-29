const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body
  const { id } = request.params;

  const searchRepository = repositories.findIndex(repo => repo.id === id);

  if (searchRepository === -1) {
    return response.status(400).json({ erro: 'Repositório não encontrato' });
  }

  const repositorio = { id, title, url, techs, likes: repositories[searchRepository].likes }
  repositories[searchRepository] = repositorio;
  return response.json(repositorio);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const searchRepository = repositories.findIndex(repo => repo.id === id);

  if (searchRepository >= 0) {
    repositories.splice(searchRepository, 1);
  } else {
    return response.status(400).json({ erro: 'Repositório não encontrato' });
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const searchRepository = repositories.findIndex(repo => repo.id === id);

  if (searchRepository === -1) {
    return response.status(400).json({ erro: 'Repositório não encontrato' });
  }
  repositories[searchRepository].likes++;

  return response.json(repositories[searchRepository]);


});

module.exports = app;
