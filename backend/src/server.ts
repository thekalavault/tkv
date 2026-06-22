import dotenv from 'dotenv';
import { app } from './app';
import { logger } from './shared/logger/logger';
import { verifyConnections } from './shared/utils/connection-verifier';

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app
  .listen(port, async () => {
    logger.info({ port }, 'Kala Vault backend listening');
    await verifyConnections();
    logger.info('All third‑party connections verified');
  })
  .on('error', (error) => {
    logger.error({ error }, 'Server startup failed');
    process.exit(1);
  });
