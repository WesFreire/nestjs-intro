import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

/**
 * Class to connect to Users table and perform business operations
 */
@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>){}

  public async createUser(createUserDto: CreateUserDto) {
    // Check if user with email exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    /**
     * Handle exceptions if user exists later
     * */

    // Try to create a new user
    // - Handle Exceptions Later
    let newUser = this.usersRepository.create(createUserDto);
    newUser = await this.usersRepository.save(newUser);

    // Create the user
    return newUser;
  }

  /**
   * The method to get all the users from the database
   */
  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
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
