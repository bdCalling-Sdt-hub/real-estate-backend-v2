import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse'; 
import { SubscriptionService } from './subscriptions.service';

// Create user subscription
const createSubscriptions = catchAsync(
  async (req: Request, res: Response) => {
    req.body.user = req.user?.userId;
    const result = await SubscriptionService.createSubscriptions(
      req.body,
    );
    sendResponse(req, res, {
      statusCode: 200,
      success: true,
      message: 'Subscription create successfully',
      data: result,
    });
  },
);

// Get all user subscriptions
const getAllSubscriptions = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubscriptionService.getAllSubscriptions(
      req.query,
    );
    sendResponse(req, res, {
      statusCode: 200,
      success: true,
      message: 'All subscriptions retrieved successfully',
      data: result,
    });
  },
);

// Get user subscription by ID
const getSubscriptionById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubscriptionService.getSubscriptionById(
      req.params.id,
    );
    sendResponse(req, res, {
      statusCode: 200,
      success: true,
      message: 'subscription retrieved successfully',
      data: result,
    });
  },
);

// Update user subscription
const updateSubscription = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubscriptionService.updateSubscription(
      req.params.id,
      req.body,
    );
    sendResponse(req, res, {
      statusCode: 200,
      success: true,
      message: 'subscription updated successfully',
      data: result,
    });
  },
);

// Get my subscriptions
const mySubscriptions = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const result = await SubscriptionService.mySubscriptions(userId);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'My subscriptions retrieved successfully',
    data: result,
  });
});

// Delete user subscription
const deleteSubscriptions = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubscriptionService.deleteSubscriptions(
      req.params.id,
    );
    sendResponse(req, res, {
      statusCode: 200,
      success: true,
      message: 'subscription deleted successfully',
      data: result,
    });
  },
);

export const SubscriptionsController = {
  createSubscriptions,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  mySubscriptions,
  deleteSubscriptions,
};
