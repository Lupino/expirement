import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import http from 'http';
import path from 'path';

import next from 'next';
import {promiseToCallback} from './utils';
import { route } from './api';

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

promiseToCallback(app.prepare.bind(app))((err) => {
  if (err) {
    console.log(err);
  }
  const server = express();
  server.set('port', process.env.PORT || 3000);
  server.set('host', process.env.HOST || '127.0.0.1');

  server.use(bodyParser.urlencoded({extended: false, limit: '512kb'}));
  server.use(bodyParser.json());
  server.use(methodOverride());
  route(server);

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  http.createServer(server).listen(server.get('port'), server.get('host'), () => {
    /* eslint-disable no-console */
    console.log('Express server listening on port ' + (server.get('port')));
    /* eslint-enable no-console */
  });
});
