import express, { Request, Response } from 'express';
import { fetchUsers, updateHasSpunStatus, validateUserCredentials } from './service/users-service';
import { mapUsersToUsersResponse } from './models/api-adapter';
import { HasSpunRequest, LoginRequest, LoginResponse, UsersResponse, UserResponse } from './models/api-models';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit'
import http from "http";
import { Server } from "socket.io";

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*" }
});

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})

app.use(limiter)

//REFACTOR THIS FUNCTION
app.get('/users', async (req: Request, res: Response<UsersResponse>) => {
  // This is middleware that checks authentication
  verifyToken(req, res, async () => {
    try {
      // This callback is the "next" function
      // Only runs if token is valid
      const username = (req as any).user.username;

      const users = await fetchUsers();
      const currentUser = users.find(user => user.username === username);

      if (currentUser === undefined) {
        return res.status(403).json({ error: 'User not found', users });
      }

      if (currentUser.hasSpun) {
        const assignedUser = users.find(user => user.name === currentUser.secretSanta);
        if (!assignedUser) {
          return res.status(404).json({ error: 'Assigned user not found', users: [] });
        }
        const responseAssignedUser: UserResponse = { name: assignedUser.name, hasSpun: true };
        return res.status(200).json({ users: [responseAssignedUser] });
      }

      const assignedNames = new Set(
        users
          .map(u => u.secretSanta)
          .filter((n): n is string => typeof n === 'string' && n.length > 0)
      );

      const filteredUsers = users.filter(user => {
        return user.username !== username &&
          (!currentUser.partnerName || user.name !== currentUser.partnerName) &&
          !user.hasSpun &&
          !assignedNames.has(user.name);
      });

      return res.status(200).json(mapUsersToUsersResponse(filteredUsers));
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error', users: [] });
    }
  });
});

app.put('/has-spun', async (req: Request<{}, any, HasSpunRequest>, res: Response<string>) => {
  const { hasSpun, secretSantaName } = req.body;
  verifyToken(req, res, async () => {
    const username = (req as any).user.username;
    const result = await updateHasSpunStatus(username, hasSpun, secretSantaName);
    io.emit('hasSpunUpdated', { triggeredBy: (req as any).user.username });
    return res.status(200).json(result);
  });
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

app.get('/current-user', (req: Request, res: Response<UserResponse | { error: string }>) => {
  verifyToken(req, res, () => {
    const username = (req as any).user.username;
    return res.status(200).json({ name: username });
  });
});

app.post('/verify-token', (_, res: Response<{ valid: boolean }>) => {
  verifyToken(_, res, () => {
    res.status(200).json({ valid: true });
  });
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
});

/**
 * Middleware function to verify JWT tokens in incoming requests
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Callback function to pass control to the next middleware
 */
function verifyToken(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ valid: false, message: 'No token provided' });
  }

  try {
    // Verify the token using the JWT secret and decode the payload
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
    // Attach the decoded user information to the request object for downstream use
    (req as any).user = decoded;
    // Pass control to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ valid: false, message: 'Invalid token' });
  }
}

export { httpServer };
export default app;

/**
Middleware is a function that sits between the incoming request and the final route handler in Express.js. It has access to the request object (req), response object (res), and a next function.

Key characteristics:

Executes in sequence - Middleware functions run in the order they're defined
Can modify req/res - They can read/modify request and response objects
Controls flow - Calls next() to pass control to the next middleware, or sends a response to end the request-response cycle
Common uses:

Authentication/authorization (like your verifyToken)
Logging
Parsing request bodies
Error handling
Rate limiting
 */