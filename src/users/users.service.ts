import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { AuthService } from 'src/auth/auth.service';

/**
 * Class to connect to Users table and perform business operations
 */
@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  /**
   * The method to get all the users from the database
   */
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

  /**
   * Find a single user using the ID of the user
   */
  public findAllById(id: string) {
    return {
      id: 1234,
      firstName: 'Alice',
      email: 'alice@doe.com',
    };
  }
}
