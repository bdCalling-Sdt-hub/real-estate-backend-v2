import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { paymentsService } from './payments.service';
import sendResponse from '../../utils/sendResponse';

const initiatePayment = catchAsync(async (req: Request, res: Response) => {
  req.body.user = req.user.userId;

  const result = await paymentsService.initiatePayment(req.body);

  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'initial Url get successfully',
    data: result,
  });
});

// //web hook
const webhook = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentsService.webhook(req?.body);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Payment successfully',
    data: result,
  });
});

const myIncome = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentsService.myIncome(req?.user?.userId, req.query);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Payment successfully',
    data: result,
  });
});

const myPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentsService.myPayments(req?.user.userId);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Payment successfully',
    data: result,
  });
});

const packageIncome = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentsService.packageIncome();
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Package Income Get Successfully',
    data: result,
  });
});

const PercentageIncome = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentsService.PercentageIncome();
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Percentage Income Get Successfully',
    data: result,
  });
});

const todayAndTotalIncome = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentsService.todayAndTotalIncome(req.query);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Today And Total Income Get Successfully',
    data: result,
  });
});

const PackagesStatisticsIncomes = catchAsync(
  async (req: Request, res: Response) => {
    const result = await paymentsService.PackagesStatisticsIncomes(req.query);
    sendResponse(req, res, {
      statusCode: 200,
      success: true,
      message: 'Packages statistics incomes get successfully',
      data: result,
    });
  },
);

const PercentageStatisticsIncomes = catchAsync(
  async (req: Request, res: Response) => {
    const result = await paymentsService.PercentageStatisticsIncomes(req.query);
    sendResponse(req, res, {
      statusCode: 200,
      success: true,
      message: 'Percentage statistics incomes get successfully',
      data: result,
    });
  },
);

const calculatePackageNameByIncome = catchAsync(
  async (req: Request, res: Response) => {
    const result = await paymentsService.calculatePackageNameByIncome(
      req.query,
    );
    sendResponse(req, res, {
      statusCode: 200,
      success: true,
      message: 'package incomes by package name get successfully',
      data: result,
    });
  },
);


const topLandlordIncome = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentsService.topLandlordIncome();
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Top landlord income get successfully',
    data: result,
  });
});

export const paymentsController = {
  initiatePayment,
  webhook,
  myIncome,
  myPayments,
  packageIncome,
  PercentageIncome,
  todayAndTotalIncome,
  PackagesStatisticsIncomes,
  PercentageStatisticsIncomes,
  calculatePackageNameByIncome,
  topLandlordIncome,
};
