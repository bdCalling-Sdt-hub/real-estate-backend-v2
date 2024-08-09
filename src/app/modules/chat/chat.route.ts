import { Router } from 'express';
import { chatController } from './chat.controller';
import validateRequest from '../../middleware/validateRequest';
import { chatValidation } from './chat.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/',
  auth(
    USER_ROLE.admin,
    USER_ROLE.landlord,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.user,
  ),
  validateRequest(chatValidation.createChatValidation),
  chatController.createChat,
);

router.patch(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.landlord,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.user,
  ),
  validateRequest(chatValidation.createChatValidation),
  chatController.updateChat,
);

router.delete(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.landlord,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.user,
  ),
  chatController.deleteChat,
);

router.get(
  '/my-chat-list',
  auth(
    USER_ROLE.admin,
    USER_ROLE.landlord,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.user,
  ),
  chatController.getMyChatList,
);

router.get(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.landlord,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.user,
  ),
  chatController.getChatById,
);

export const chatRoutes = router;
