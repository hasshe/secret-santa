import express, { Request, Response } from 'express';
import { fetchUsers, updateHasSpunStatus } from './service/users-service';
import { mapUsersToUsersResponse } from './models/api-adapter';
import { HasSpunRequest, UsersResponse } from './models/api-models';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.get('/users', async (_: Request, res: Response<UsersResponse>) => {
  const users = await fetchUsers();
  return res.json(mapUsersToUsersResponse(users));
});

app.put('/has-spun', async (req: Request<HasSpunRequest>, res: Response) => {
  const { name, hasSpun, secretSantaName } = req.body;
  await updateHasSpunStatus(name, hasSpun, secretSantaName);
  res.sendStatus(204);
});

export default app;