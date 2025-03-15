import { Request, Response } from 'express';
import { User, UserRole } from '../models/User';
import jwt from 'jsonwebtoken';
import { validate } from 'class-validator';
import { AppDataSource } from '../config/database';

export class AuthController {
  static register = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, role } = req.body;

    const userRepository = AppDataSource.getRepository(User);
    
    try {
      // Check if user already exists
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = new User();
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.password = password;
      user.role = role ? role : UserRole.EMPLOYEE;

      // Validate the user entity
      const errors = await validate(user);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      // Hash password before saving
      user.hashPassword();

      // Save the user
      await userRepository.save(user);

      // Remove password from response
      delete (user as any).password;

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  };

  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userRepository = AppDataSource.getRepository(User);

    try {
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      if (!user.checkPassword(password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Remove password from response
      delete (user as any).password;

      res.json({ user, token });
    } catch (error) {
      res.status(500).json({ message: 'Error during login', error });
    }
  };
} 