import express from 'express';
import { fetchUsers } from './service/users-service';

const app = express();

app.get('/status', (req, res) => {
  res.json({ status: 'API is running' });
});

app.get('/users', async (req, res) => {
  const users = await fetchUsers();
  return res.json(users);
});

export default app;