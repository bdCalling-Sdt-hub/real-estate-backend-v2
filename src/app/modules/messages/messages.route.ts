import { Router } from 'express';
import { messagesController } from './messages.controller';
import validateRequest from '../../middleware/validateRequest';
import { messagesValidation } from './messages.validation';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middleware/parseData';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/send-messages',
  auth(
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.user,
    USER_ROLE.landlord,
  ),
  upload.single('image'),
  parseData(),
  validateRequest(messagesValidation.sendMessageValidation),
  messagesController.createMessages,
);

router.patch(
  '/seen/:chatId',
  auth(
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.user,
    USER_ROLE.landlord,
  ),

  messagesController.seenMessage,
);

router.patch(
  '/update/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.user,
  ),
  upload.single('image'),
  parseData(),
  validateRequest(messagesValidation.updateMessageValidation),
  messagesController.updateMessages,
);

router.get('/my-messages/:chatId', messagesController.getMessagesByChatId);

router.delete(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.user,
    USER_ROLE.landlord,
  ),
  messagesController.deleteMessages,
);

router.get(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.user,
    USER_ROLE.landlord,
  ),
  messagesController.getMessagesById,
);

router.get(
  '/',
  auth(
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.user,
    USER_ROLE.landlord,
  ),
  messagesController.getAllMessages,
);

export const messagesRoutes = router;
