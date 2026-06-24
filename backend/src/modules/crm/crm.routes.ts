import { Router } from 'express';
import { CrmController } from './crm.controller';
import { authGuard, roleGuard } from '../../shared/middleware/auth.middleware';
import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();
const crmController = new CrmController();

// Only admins can view CRM leads
router.get(
  '/leads',
  authGuard,
  roleGuard(['admin']),
  asyncHandler(crmController.getLeads.bind(crmController))
);

export { router as crmRouter };
