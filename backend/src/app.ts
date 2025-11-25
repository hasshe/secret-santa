import express from 'express';

const app = express();

app.get('/status', (req, res) => {
  res.json({ status: 'API is running' });
});

app.get('/users', (req, res) => {
  return res.json([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]);
});

export default app;