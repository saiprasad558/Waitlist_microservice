import { HttpService } from '@nestjs/axios';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import axios from 'axios';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    const token = request.headers.authorization?.split('Bearer ').pop();

    if (isPublic && !token) {
      return true;
    }

    if (!token && !isPublic) {
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
      if (!authId && !isPublic) {
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
}
