import { Response } from 'express';
import { AuthRequest } from '../../shared/middleware/auth.middleware';
import { UsersService } from './users.service';

const usersService = new UsersService();

export class UsersController {
  async me(req: AuthRequest, res: Response) {
    const user = await usersService.getProfile(req.user?.id as string);
    res.json(user);
  }

  async updateProfile(req: AuthRequest, res: Response) {
    const updated = await usersService.updateProfile(req.user?.id as string, req.body);
    res.json(updated);
  }

  async listUsers(req: AuthRequest, res: Response) {
    const users = await usersService.listUsers(req.query);
    res.json(users);
  }
}
