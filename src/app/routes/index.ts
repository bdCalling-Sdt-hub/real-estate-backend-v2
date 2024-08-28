import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.route';
import { notificationRoutes } from '../modules/notification/notificaiton.route';
import { otpRoutes } from '../modules/otp/otp.routes';
import { userRoutes } from '../modules/user/user.route';
import { categoryRoutes } from '../modules/category/category.route';
import { adsRoutes } from '../modules/ads/ads.route';
import { ResidenceRouter } from '../modules/residence/residence.route';
import { BookingResidenceRoutes } from '../modules/bookingResidence/bookingResidence.route';
// import { SubscriptionsBookingRoutes } from '../modules/subscriptionBooking/subscriptionBooking.route';
import { paymentsRoutes } from '../modules/payments/payments.route';
import { contentsRoutes } from '../modules/contents/contents.route';
import { reviewRoutes } from '../modules/review/review.route';
import { favoriteItemRoutes } from '../modules/favoriteItem/favoriteItem.route';
import { chatRoutes } from '../modules/chat/chat.route';
import { messagesRoutes } from '../modules/messages/messages.route';
import { maintenanceRequestRoutes } from '../modules/maintenanceRequest/maintenanceRequest.route';
import { PackageRoutes } from '../modules/package/package.route';
import { SubscriptionsRoutes } from '../modules/subscriptions/subscriptions.route';
import { AdsCategoryRoutes } from '../modules/adsCategory/adsCategory.route';
import { bookingDocumentsRoutes } from '../modules/bookingDocuments/bookingDocuments.route';

const router = Router();
const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/otp',
    route: otpRoutes,
  },
  {
    path: '/notifications',
    route: notificationRoutes,
  },
  {
    path: '/categories',
    route: categoryRoutes,
  },
  {
    path: '/ads-categories',
    route: AdsCategoryRoutes,
  },
  {
    path: '/ads',
    route: adsRoutes,
  },
  {
    path: '/residences',
    route: ResidenceRouter,
  },
  {
    path: '/bookings',
    route: BookingResidenceRoutes,
  },
  {
    path: '/subscriptions',
    route: SubscriptionsRoutes,
  },
  {
    path: '/package',
    route: PackageRoutes,
  },
  {
    path: '/contents',
    route: contentsRoutes,
  },
  {
    path: '/booking-documents',
    route: bookingDocumentsRoutes,
  },
  {
    path: '/payments',
    route: paymentsRoutes,
  },
  {
    path: '/review',
    route: reviewRoutes,
  },
  {
    path: '/messages',
    route: messagesRoutes,
  },
  {
    path: '/chats',
    route: chatRoutes,
  },
  {
    path: '/favorite-items',
    route: favoriteItemRoutes,
  },
  {
    path: '/maintenance-request',
    route: maintenanceRequestRoutes,
  },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
