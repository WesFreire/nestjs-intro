import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(()=> UsersService))
    private readonly usersService: UsersService) { }

  public login(email: string, password: string, id: string) {
    // Check if user exists in database
    // Return Token
    const user = this.usersService.findAllById('1234');

    return 'SAMPLE_TOKEN';
  }

  public isAuth() {
    return true;
  }
}
