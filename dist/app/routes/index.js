"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const notificaiton_route_1 = require("../modules/notification/notificaiton.route");
const otp_routes_1 = require("../modules/otp/otp.routes");
const user_route_1 = require("../modules/user/user.route");
const category_route_1 = require("../modules/category/category.route");
const ads_route_1 = require("../modules/ads/ads.route");
const residence_route_1 = require("../modules/residence/residence.route");
const bookingResidence_route_1 = require("../modules/bookingResidence/bookingResidence.route");
// import { SubscriptionsBookingRoutes } from '../modules/subscriptionBooking/subscriptionBooking.route';
const payments_route_1 = require("../modules/payments/payments.route");
const contents_route_1 = require("../modules/contents/contents.route");
const review_route_1 = require("../modules/review/review.route");
const favoriteItem_route_1 = require("../modules/favoriteItem/favoriteItem.route");
const chat_route_1 = require("../modules/chat/chat.route");
const messages_route_1 = require("../modules/messages/messages.route");
const maintenanceRequest_route_1 = require("../modules/maintenanceRequest/maintenanceRequest.route");
const package_route_1 = require("../modules/package/package.route");
const subscriptions_route_1 = require("../modules/subscriptions/subscriptions.route");
const adsCategory_route_1 = require("../modules/adsCategory/adsCategory.route");
const bookingDocuments_route_1 = require("../modules/bookingDocuments/bookingDocuments.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/users',
        route: user_route_1.userRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.authRoutes,
    },
    {
        path: '/otp',
        route: otp_routes_1.otpRoutes,
    },
    {
        path: '/notifications',
        route: notificaiton_route_1.notificationRoutes,
    },
    {
        path: '/categories',
        route: category_route_1.categoryRoutes,
    },
    {
        path: '/ads-categories',
        route: adsCategory_route_1.AdsCategoryRoutes,
    },
    {
        path: '/ads',
        route: ads_route_1.adsRoutes,
    },
    {
        path: '/residences',
        route: residence_route_1.ResidenceRouter,
    },
    {
        path: '/bookings',
        route: bookingResidence_route_1.BookingResidenceRoutes,
    },
    {
        path: '/subscriptions',
        route: subscriptions_route_1.SubscriptionsRoutes,
    },
    {
        path: '/package',
        route: package_route_1.PackageRoutes,
    },
    {
        path: '/contents',
        route: contents_route_1.contentsRoutes,
    },
    {
        path: '/booking-documents',
        route: bookingDocuments_route_1.bookingDocumentsRoutes,
    },
    {
        path: '/payments',
        route: payments_route_1.paymentsRoutes,
    },
    {
        path: '/review',
        route: review_route_1.reviewRoutes,
    },
    {
        path: '/messages',
        route: messages_route_1.messagesRoutes,
    },
    {
        path: '/chats',
        route: chat_route_1.chatRoutes,
    },
    {
        path: '/favorite-items',
        route: favoriteItem_route_1.favoriteItemRoutes,
    },
    {
        path: '/maintenance-request',
        route: maintenanceRequest_route_1.maintenanceRequestRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
