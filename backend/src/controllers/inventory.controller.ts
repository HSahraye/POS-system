import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Product } from '../models/Product';
import { validate } from 'class-validator';
import { AuthRequest } from '../middleware/auth.middleware';

export class InventoryController {
  static getProducts = async (req: Request, res: Response) => {
    const productRepository = getRepository(Product);
    
    try {
      const products = await productRepository.find({
        where: { isActive: true },
        order: { createdAt: 'DESC' }
      });
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error });
    }
  };

  static getProduct = async (req: Request, res: Response) => {
    const productRepository = getRepository(Product);
    
    try {
      const product = await productRepository.findOne({
        where: { id: req.params.id, isActive: true }
      });
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching product', error });
    }
  };

  static createProduct = async (req: AuthRequest, res: Response) => {
    const productRepository = getRepository(Product);
    
    try {
      const product = new Product();
      Object.assign(product, req.body);
      product.createdById = req.userId!;

      const errors = await validate(product);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      await productRepository.save(product);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error creating product', error });
    }
  };

  static updateProduct = async (req: Request, res: Response) => {
    const productRepository = getRepository(Product);
    
    try {
      const product = await productRepository.findOne({
        where: { id: req.params.id, isActive: true }
      });
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      Object.assign(product, req.body);
      
      const errors = await validate(product);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      await productRepository.save(product);
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error updating product', error });
    }
  };

  static deleteProduct = async (req: Request, res: Response) => {
    const productRepository = getRepository(Product);
    
    try {
      const product = await productRepository.findOne({
        where: { id: req.params.id, isActive: true }
      });
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Soft delete
      product.isActive = false;
      await productRepository.save(product);
      
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting product', error });
    }
  };

  static updateStock = async (req: Request, res: Response) => {
    const { quantity, type } = req.body;
    const productRepository = getRepository(Product);
    
    try {
      const product = await productRepository.findOne({
        where: { id: req.params.id, isActive: true }
      });
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      if (type === 'add') {
        product.quantity += quantity;
      } else if (type === 'remove') {
        if (product.quantity < quantity) {
          return res.status(400).json({ message: 'Insufficient stock' });
        }
        product.quantity -= quantity;
      } else {
        return res.status(400).json({ message: 'Invalid stock update type' });
      }

      await productRepository.save(product);
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error updating stock', error });
    }
  };

  static getLowStockProducts = async (req: Request, res: Response) => {
    const productRepository = getRepository(Product);
    
    try {
      const products = await productRepository
        .createQueryBuilder('product')
        .where('product.isActive = :isActive', { isActive: true })
        .andWhere('product.quantity <= product.lowStockThreshold')
        .getMany();

      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching low stock products', error });
    }
  };

  static bulkUpdateProducts = async (req: Request, res: Response) => {
    const { products } = req.body;
    const productRepository = getRepository(Product);
    
    try {
      const updatedProducts = await Promise.all(
        products.map(async (productData: any) => {
          const product = await productRepository.findOne({
            where: { id: productData.id, isActive: true }
          });
          
          if (!product) {
            throw new Error(`Product with ID ${productData.id} not found`);
          }

          Object.assign(product, productData);
          return productRepository.save(product);
        })
      );

      res.json(updatedProducts);
    } catch (error) {
      res.status(500).json({ message: 'Error updating products', error });
    }
  };
} 