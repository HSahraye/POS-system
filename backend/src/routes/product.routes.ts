import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Product } from '../models/Product';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { validateRole } from '../middleware/validateRole';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all products
router.get('/', validateRole(['ADMIN', 'MANAGER', 'EMPLOYEE']), async (req: AuthRequest, res) => {
  try {
    const productRepository = getRepository(Product);
    const products = await productRepository.find({
      order: { name: 'ASC' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// Get product by ID
router.get('/:id', validateRole(['ADMIN', 'MANAGER', 'EMPLOYEE']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const productRepository = getRepository(Product);
    const product = await productRepository.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
});

// Get product by barcode
router.get('/barcode/:barcode', validateRole(['ADMIN', 'MANAGER', 'EMPLOYEE']), async (req: AuthRequest, res) => {
  try {
    const { barcode } = req.params;
    const productRepository = getRepository(Product);
    const product = await productRepository.findOne({ where: { barcode } });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
});

// Create product
router.post('/', validateRole(['ADMIN', 'MANAGER']), async (req: AuthRequest, res) => {
  try {
    const {
      name,
      description,
      price,
      stockQuantity,
      lowStockThreshold,
      barcode,
      image
    } = req.body;

    const productRepository = getRepository(Product);

    // Check if product with barcode already exists
    if (barcode) {
      const existingProduct = await productRepository.findOne({ where: { barcode } });
      if (existingProduct) {
        return res.status(400).json({ message: 'Product with this barcode already exists' });
      }
    }

    // Create product
    if (!req.user?.id) {
      return res.status(401).json({ message: 'User ID not found' });
    }

    const product = productRepository.create({
      name,
      description,
      price,
      stockQuantity,
      lowStockThreshold: lowStockThreshold || 10,
      barcode,
      imageUrl: image,
      createdById: req.user.id,
      isActive: true
    });

    await productRepository.save(product);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
});

// Update product
router.put('/:id', validateRole(['ADMIN', 'MANAGER']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      stockQuantity,
      lowStockThreshold,
      barcode,
      image,
      isActive
    } = req.body;

    const productRepository = getRepository(Product);
    const product = await productRepository.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stockQuantity = stockQuantity || product.stockQuantity;
    product.lowStockThreshold = lowStockThreshold || product.lowStockThreshold;
    product.barcode = barcode || product.barcode;
    product.imageUrl = image || product.imageUrl;
    product.isActive = isActive !== undefined ? isActive : product.isActive;

    await productRepository.save(product);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
});

// Update stock quantity
router.patch('/:id/stock', validateRole(['ADMIN', 'MANAGER', 'EMPLOYEE']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { quantity, type } = req.body; // type can be 'add' or 'remove'
    const productRepository = getRepository(Product);

    const product = await productRepository.findOne({ where: { id } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update stock quantity
    if (type === 'add') {
      product.stockQuantity += quantity;
    } else if (type === 'remove') {
      if (product.stockQuantity < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      product.stockQuantity -= quantity;
    }

    await productRepository.save(product);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating stock', error });
  }
});

// Delete product
router.delete('/:id', validateRole(['ADMIN']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const productRepository = getRepository(Product);

    const product = await productRepository.findOne({ where: { id } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Soft delete by setting isActive to false
    product.isActive = false;
    await productRepository.save(product);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

export default router; 