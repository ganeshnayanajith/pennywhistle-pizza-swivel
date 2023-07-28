import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'Pennywhistle Pizza Ordering API - Swivel' });
});

export default router;
