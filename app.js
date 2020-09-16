const createError = require('http-errors');
const fs = require('fs');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mean-angular6')
  .then(() => console.log('connection succesful'))
  .catch((err) => console.error(err));

const apiRouter = require('./routes/index');

const app = express();
const server = app.listen(3000, function () {
  console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/index', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/policy', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));
app.use('/step2', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/step3', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/roof', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/exterior', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/step4', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/step5', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/step6', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/step7', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/step8', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/step9', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/esign', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/retrieve', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/get_quote_data', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/', express.static(path.join(__dirname, 'dist/mdb-angular-free')));
app.use('/api', apiRouter);
app.use(function (req, res, next) {
  next(createError(404));
});
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.status);
});
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
module.exports = app;



