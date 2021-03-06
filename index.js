"use strict";
import express      from 'express';
import path         from 'path';
import cors from 'cors';
import logger       from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser   from 'body-parser';
import io from 'socket.io';
import ioCookieParser from 'socket.io-cookie-parser';
import routes from './src/routes';

let app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors());

app.io = io();
app.io.use(ioCookieParser());

// Pass down the io object to the routes
app.use('/', routes(app.io));

app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});



export default app;