// server.mjs

import 'dotenv/config';
import express from 'express';
import pool from './db.mjs';
import { USER_API } from './routes/usersRoute.mjs';
import SuperLogger from './modules/SuperLogger.mjs';
import printDeveloperStartupInportantInformationMSG from './modules/developerHelpers.mjs';

printDeveloperStartupInportantInformationMSG();

const server = express();
const port = process.env.PORT || 8080;
server.set('port', port);

const logger = new SuperLogger();
server.use(logger.createAutoHTTPRequestLogger());



server.use(express.static('public'));
server.use('/user', USER_API);

server.get('/', (req, res, next) => {
  res.status(200).send(JSON.stringify({ msg: 'Hello, world! Your server is up and running' })).end();
});

server.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: '⚠ Internal Server Error' });
});

server.listen(port, () => {
  console.log('Server running on port', port);
});
