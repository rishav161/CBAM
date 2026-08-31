import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../config/database.js';
import { sendWelcomeEmail } from '../services/emailService.js';

/**
 * Generates a random secure 12-character temporary password.
 */
function generateTempPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = 'Cbam#';
  for (let i = 0; i < 7; i++) {
    password += chars.charAt(crypto.randomInt(0, chars.length));
  }
  return password;
}

export async function createCustomerUser(req, res) {
  try {
    const { email, name, company } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and Name are required fields' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return res.status(400).json({ error: 'A user with this email address already exists' });
    }

    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newUser = await prisma.user.create({
      data: {
        email: cleanEmail,
        password: hashedPassword,
        name: name.trim(),
        company: company ? company.trim() : null,
        role: 'CUSTOMER',
        isActive: true,
        mustChangePassword: true,
      },
    });

    // Create Audit Log entry
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'CREATE_CUSTOMER_USER',
        details: `Created customer account for ${cleanEmail} (${name.trim()})`,
      },
    });

    // Send Welcome Email with temporary credentials
    await sendWelcomeEmail({
      email: cleanEmail,
      name: name.trim(),
      tempPassword,
    });

    res.status(201).json({
      message: 'Customer account created successfully. Welcome email with temporary password dispatched.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        company: newUser.company,
        role: newUser.role,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt,
      },
      tempPassword, // Returned for admin preview/testing
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create customer user account' });
  }
}

export async function listUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        company: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
        createdAt: true,
        _count: {
          select: { batches: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users list' });
  }
}

export async function toggleUserStatus(req, res) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'SUPER_ADMIN') {
      return res.status(400).json({ error: 'Superadmin account status cannot be modified' });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: Boolean(isActive) },
      select: { id: true, email: true, name: true, isActive: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'TOGGLE_USER_STATUS',
        details: `Set status of user ${updated.email} to ${updated.isActive ? 'ACTIVE' : 'INACTIVE'}`,
      },
    });

    res.status(200).json({ message: 'User status updated', user: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user status' });
  }
}
