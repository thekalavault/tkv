import { prisma } from '../../shared/db/prisma';
import { ApiError } from '../../shared/errors/api-error';

export class UsersService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        status: true,
        role: true,
      },
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    return user;
  }

  async updateProfile(userId: string, data: Record<string, unknown>) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName as string,
        lastName: data.lastName as string,
        phone: data.phone as string,
      },
    });
  }

  async listUsers(query: Record<string, any>) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 20);
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};

    if (query.role) {
      where.role = { name: query.role };
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: 'insensitive' } },
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          status: true,
          role: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { page, limit, total, items };
  }

  async updateUserRole(userId: string, roleName: 'admin' | 'account_manager' | 'operations' | 'customer') {
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) {
      throw new ApiError('Role not found', 400);
    }
    
    return prisma.user.update({
      where: { id: userId },
      data: { roleId: role.id },
      include: { role: true },
    });
  }

  async deleteUser(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    
    // Perform a soft delete or hard delete depending on your schema
    // In this case we'll hard delete, but realistically you'd want to cascade or soft delete
    return prisma.user.update({
      where: { id: userId },
      data: { status: 'suspended', deletedAt: new Date() }
    });
  }
}
