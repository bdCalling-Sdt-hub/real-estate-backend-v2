import { Request, Response } from 'express';

type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

export type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
  meta?: TMeta;
};

const sendResponse = <T>(req: Request, res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    message: data.message ? req.t(data?.message) : null,
    data: data.data || {} || [],
    meta: data.meta,
  });
};

export default sendResponse;
