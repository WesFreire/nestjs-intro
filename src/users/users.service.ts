import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    
    const isAuth = this.authService.isAuth()
    
    console.log(isAuth)
    return [
      {
        firstName: 'John',
        email: 'john@doe.com',
      },
      {
        firstName: 'alice',
        email: 'alice@doe.com',
      },
    ];
  }

  public findAllById(id: string) {
    return {
      id: 1234,
      firstName: 'Alice',
      email: 'alice@doe.com',
    };
  }
}
