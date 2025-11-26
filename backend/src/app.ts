import express, { Request, Response } from 'express';
import { fetchUsers, updateHasSpunStatus, validateUserCredentials } from './service/users-service';
import { mapUsersToUsersResponse } from './models/api-adapter';
import { HasSpunRequest, LoginRequest, LoginResponse, UsersResponse } from './models/api-models';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit'

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})

app.use(limiter)

app.get('/users', async (req: Request, res: Response<UsersResponse>) => {
  verifyToken(req, res, async () => {
    try {
      const username = (req as any).user.username;

      const users = await fetchUsers();
      const userExists = users.some(user => user.name === username);

      if (!userExists) {
        return res.status(403).json({ error: 'User not found', users });
      }

      return res.json(mapUsersToUsersResponse(users));
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error', users: [] });
    }
  });

});

app.put('/has-spun', async (req: Request<HasSpunRequest>, res: Response) => {
  const { name, hasSpun, secretSantaName, token } = req.body;
  await updateHasSpunStatus(name, hasSpun, secretSantaName);
  res.sendStatus(204);
});

app.post('/login', async (req: Request<LoginRequest>, res: Response<LoginResponse>) => {
  const { username, password } = req.body;

  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'password';

  let isAuthenticated = false;
  if (username !== adminUsername || password !== adminPassword) {
    isAuthenticated = await validateUserCredentials(username, password);
    if (isAuthenticated) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
      return res.status(200).json({ authenticated: true, token: token });
    } else {
      return res.status(401).json({ authenticated: false, token: undefined });
    }
  } else {
    isAuthenticated = true;
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    return res.status(200).json({ authenticated: true, token: token });
  }
});

app.post('/verify-token', (_, res: Response<{ valid: boolean }>) => {
  verifyToken(_, res, () => {
    res.status(200).json({ valid: true });
  });
});

function verifyToken(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ valid: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ valid: false, message: 'Invalid token' });
  }
}

export default app;