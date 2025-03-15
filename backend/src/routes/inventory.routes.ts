import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';
import { authMiddleware, checkRole } from '../middleware/auth.middleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all products
router.get('/products', InventoryController.getProducts);

// Get low stock products
router.get('/products/low-stock', InventoryController.getLowStockProducts);

// Get single product
router.get('/products/:id', InventoryController.getProduct);

// Create new product (managers and admins only)
router.post(
  '/products',
  checkRole(['admin', 'manager']),
  InventoryController.createProduct
);

// Update product (managers and admins only)
router.put(
  '/products/:id',
  checkRole(['admin', 'manager']),
  InventoryController.updateProduct
);

// Delete product (admins only)
router.delete(
  '/products/:id',
  checkRole(['admin']),
  InventoryController.deleteProduct
);

// Update stock levels
router.patch(
  '/products/:id/stock',
  checkRole(['admin', 'manager', 'employee']),
  InventoryController.updateStock
);

// Bulk update products (managers and admins only)
router.post(
  '/products/bulk-update',
  checkRole(['admin', 'manager']),
  InventoryController.bulkUpdateProducts
);

export default router; 