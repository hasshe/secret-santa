import express, { Request, Response } from 'express';
import { fetchUsers, updateHasSpunStatus, validateUserCredentials } from './service/users-service';
import { mapUsersToUsersResponse } from './models/api-adapter';
import { HasSpunRequest, LoginRequest, LoginResponse, UsersResponse } from './models/api-models';
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

app.post('/login', async (req: Request<LoginRequest>, res: Response<LoginResponse>) => {
  const { username, password } = req.body;

  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'password';

  if (username !== adminUsername) {
    const isValidCredentials = await validateUserCredentials(username, password);
    if (isValidCredentials) {
      return res.status(200).json({ authenticated: true });
    } else {
      return res.status(401).json({ authenticated: false });
    }
  }

  if (!password) {
    return res.status(401).json({ authenticated: false });
  }
  if (password === adminPassword) {
    return res.status(200).json({ authenticated: true });
  } else {
    return res.status(401).json({ authenticated: false });
  }
});

export default app;