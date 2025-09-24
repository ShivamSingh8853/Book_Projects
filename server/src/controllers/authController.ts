import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../models/database';
import { User } from '../models/types';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { validateEmail, validatePassword } from '../utils/validation';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = db.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const newUser: User = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      createdAt: new Date()
    };

    const createdUser = db.createUser(newUser);
    
    // Generate token
    const token = generateToken({
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name
    });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
