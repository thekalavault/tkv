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
}
