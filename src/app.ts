import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import MessageResponse from './interfaces/response.interface';
import { notFound, errorHandler } from './middlewares';
import auth from './api/v1/auth/auth.controller';
import users from './api/v1/users/user.controller';
require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'Hello World',
  });
});

app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use(notFound);
app.use(errorHandler);

export default app;
