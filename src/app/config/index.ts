import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join((process.cwd(), '.env')) });

const aws = {
  accessKeyId: process.env.S3_BUCKET_ACCESS_KEY,
  secretAccessKey: process.env.S3_BUCKET_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  bucket: process.env.AWS_BUCKET_NAME,
};

// const stripe = {
//   stripe_api_key: process.env.STRIPE_API_KEY,
//   stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
//   // stripe_api_secret: process.env.STRIPE_API_SECRET,
// };
const payment = {
  payment_api_key: process.env.PAYMENT_API_KEY,
  payment_api_secret: process.env.PAYMENT_API_KEY_SECRET,
  payment_token: process.env.PAYMENT_TOKEN,
  returnUrl: process.env.PAYMENT_RETURN_URL,
  cancelUrl: process.env.PAYMENT_CANCEL_URL,
  notificationUrl: process.env.PAYMENT_NOTIFICATION_URL,
};
export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  server_url: process.env.SERVER_URL,
  ip: process.env.IP,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  nodemailer_host_email: process.env.NODEMAILER_HOST_EMAIL,
  nodemailer_host_pass: process.env.NODEMAILER_HOST_PASS,
  socket_port: process.env.SOCKET_PORT,
  stripe_secret: process.env.STRIPE_SECRET,
  sms_auth_key: process.env.SMS_AUTH_KEY,
  aws,
  payment,
};
