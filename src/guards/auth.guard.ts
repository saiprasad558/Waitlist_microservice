import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const response = await this.httpService.axiosRef({
        method: 'GET',
        url: `${this.configService.get<string>(
          'authUrl',
        )}/validateToken?access_token=${token}`,
      });
      const { uId, role, auth0Id: authId } = response.data;
      if (!authId) {
        throw new UnauthorizedException(new Error('No auth0Id found'));
      }
      request.user = { uId, role, authId };
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const { data } = error.response ?? {};
        throw new UnauthorizedException(data?.message ?? error.message);
      }
      throw new UnauthorizedException(error.message);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
