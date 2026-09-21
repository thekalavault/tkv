import { Router } from 'express';
import { CrmController } from './crm.controller';
import { authGuard } from '../../shared/middleware/auth.middleware';
import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();
const crmController = new CrmController();

// CRM dashboard stats
router.get(
  '/stats',
  authGuard,
  asyncHandler(crmController.getStats.bind(crmController))
);

// Get all leads
router.get(
  '/leads',
  authGuard,
  asyncHandler(crmController.getLeads.bind(crmController))
);

// Get single lead details (with activities)
router.get(
  '/leads/:id',
  authGuard,
  asyncHandler(crmController.getLeadById.bind(crmController))
);

// Create a new lead
router.post(
  '/leads',
  authGuard,
  asyncHandler(crmController.createLead.bind(crmController))
);

// Update a lead
router.put(
  '/leads/:id',
  authGuard,
  asyncHandler(crmController.updateLead.bind(crmController))
);

// Get activities for a lead
router.get(
  '/leads/:id/activities',
  authGuard,
  asyncHandler(crmController.getActivities.bind(crmController))
);

// Log an activity for a lead
router.post(
  '/leads/:id/activities',
  authGuard,
  asyncHandler(crmController.createActivity.bind(crmController))
);

export { router as crmRouter };
