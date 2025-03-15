import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { validateRole } from '../middleware/validateRole';
import { AnalyticsService } from '../services/analytics.service';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get sales report
router.get('/sales', validateRole(['ADMIN', 'MANAGER']), async (req: Request, res: Response): Promise<void> => {
  try {
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    const report = await AnalyticsService.getSalesReport(startDate, endDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error generating sales report', error });
  }
});

// Get inventory report
router.get('/inventory', validateRole(['ADMIN', 'MANAGER']), async (req: Request, res: Response): Promise<void> => {
  try {
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    const report = await AnalyticsService.getInventoryReport(startDate, endDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error generating inventory report', error });
  }
});

// Get customer analytics
router.get('/customers/:customerId', validateRole(['ADMIN', 'MANAGER']), async (req: Request, res: Response): Promise<void> => {
  try {
    const report = await AnalyticsService.getCustomerAnalytics(req.params.customerId);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error generating customer analytics', error });
  }
});

// Get employee performance
router.get('/employees/:employeeId', validateRole(['ADMIN', 'MANAGER']), async (req: Request, res: Response): Promise<void> => {
  try {
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    const report = await AnalyticsService.getEmployeePerformance(
      req.params.employeeId,
      startDate,
      endDate
    );
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error generating employee performance report', error });
  }
});

export default router; 