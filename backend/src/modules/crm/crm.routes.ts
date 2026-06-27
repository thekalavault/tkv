import { Router } from 'express';
import { CrmController } from './crm.controller';
import { authGuard, roleGuard } from '../../shared/middleware/auth.middleware';
import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();
const crmController = new CrmController();

// Admins (or authorized team members) can view CRM leads
router.get(
  '/leads',
  authGuard,
  // roleGuard(['admin']), // Temporarily disabled so user can view leads
  asyncHandler(crmController.getLeads.bind(crmController))
);

export { router as crmRouter };
