import express, { Request, Response } from 'express';
import { fetchUsers } from './service/users-service';
import { mapUsersToUsersResponse } from './models/api-adapter';
import { UsersResponse } from './models/api-models';

const app = express();

app.get('/status', (req, res) => {
  res.json({ status: 'API is running' });
});

app.get('/users', async (req: Request, res: Response<UsersResponse>) => {
  const users = await fetchUsers();
  return res.json(mapUsersToUsersResponse(users));
});

export default app;