import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { loginSchema } from './auth.dto';
import { ApiError } from '../../shared/errors/api-error';

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError('Validation failed', 400, parsed.error.format());
    }

    const { accessToken, refreshToken, user } = await authService.login(parsed.data.email, parsed.data.password);
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role.name } });
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new ApiError('Refresh token missing', 401);
    }
    const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshToken);
    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  }
}
