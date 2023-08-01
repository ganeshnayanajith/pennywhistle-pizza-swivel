// importing required modules and libraries
import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import loggerMorgan from 'morgan';
import helmet from 'helmet';
import { API } from './lib/constant';
import { connectDB } from './lib/database';
import { swaggerUi, specs } from './lib/swagger-config';

// importing route modules
import indexRouter from './modules';
import userRouter from './modules/user/user.route';
import staffUserRouter from './modules/staff-user/staff-user.route';
import productRouter from './modules/product/product.route';
import orderRouter from './modules/order/order.route';
import reportRouter from './modules/report/report.route';

// creating the express application instance
const app = express();

(async () => {
  // establishing the database connection
  await connectDB();
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// middleware setup

// adding security headers to HTTP response
app.use(helmet());
// logging HTTP requests in development mode
app.use(loggerMorgan('dev'));
// parsing incoming JSON data
app.use(express.json());
// parsing URL-encoded data
app.use(express.urlencoded({ extended: false }));
// parsing cookies from the request
app.use(cookieParser());

// base API path
const BASE_PATH = API.BASE_PATH;

// setting up swagger documentation
app.use(`${BASE_PATH}/docs`, swaggerUi.serve, swaggerUi.setup(specs));

// setting up routes for different modules
app.use(`${BASE_PATH}/`, indexRouter);
app.use(`${BASE_PATH}/user`, userRouter);
app.use(`${BASE_PATH}/staff-user`, staffUserRouter);
app.use(`${BASE_PATH}/product`, productRouter);
app.use(`${BASE_PATH}/order`, orderRouter);
app.use(`${BASE_PATH}/report`, reportRouter);

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

// exporting the express application instance
export default app;
