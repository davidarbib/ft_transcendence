import { CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtTwoFaGuard extends AuthGuard('jwt-two-factor')
{ }