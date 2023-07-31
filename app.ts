import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import loggerMorgan from 'morgan';
import helmet from 'helmet';
import { API } from './lib/constant';
import { connectDB } from './lib/database';
import { swaggerUi, specs } from './lib/swagger-config';

import indexRouter from './modules';
import userRouter from './modules/user/user.route';
import staffUserRouter from './modules/staff-user/staff-user.route';
import productRouter from './modules/product/product.route';
import orderRouter from './modules/order/order.route';

const app = express();

(async () => {
  await connectDB();
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(helmet());
app.use(loggerMorgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const BASE_PATH = API.BASE_PATH;

app.use(`${BASE_PATH}/docs`, swaggerUi.serve, swaggerUi.setup(specs));
app.use(`${BASE_PATH}/`, indexRouter);
app.use(`${BASE_PATH}/user`, userRouter);
app.use(`${BASE_PATH}/staff-user`, staffUserRouter);
app.use(`${BASE_PATH}/product`, productRouter);
app.use(`${BASE_PATH}/order`, orderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err: createError.HttpError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
