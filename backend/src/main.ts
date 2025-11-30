import dotenv from 'dotenv';
import { httpServer } from './app';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

httpServer.listen(PORT, HOST, () => {
  const displayedHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
  console.log(`Server + Socket.IO running on http://${displayedHost}:${PORT}`);
});

