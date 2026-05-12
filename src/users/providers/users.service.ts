import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  RequestTimeoutException,
  forwardRef,
} from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';



/**
 * Controller class for '/users' API endpoint
 */
@Injectable()
export class UsersService {
  constructor(
    /**
     * Injecting User repository into UsersService
     * */
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    // Injecting ConfigService
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,

    /**
     * Inject usersCreateManyProvider
     */
    private readonly usersCreateManyProvider: UsersCreateManyProvider
  ) { }

  public async createUser(createUserDto: CreateUserDto) {

    let existingUser = undefined

    try {
      // Check if user with email exists
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      // Might sabe the details of the exception
      // Information which is sensitive
      throw new RequestTimeoutException(
        'Unable to process at the moment please try later',
        {
          description: 'Error connecting to the database'
        })

    }
    /**
     * Handle exceptions if user exists later
     * */
    if (existingUser) {
      throw new BadRequestException(
        'The user already exists, please check your email'
      )
    }
    // Try to create a new user
    // - Handle Exceptions Later
    let newUser = this.usersRepository.create(createUserDto);

    try {
      newUser = await this.usersRepository.save(newUser);
    }
    catch (error) {
      throw new RequestTimeoutException(
        'Unable to process at the moment please try later',
        {
          description: 'Error connecting to the database'
        })
    }

    // Create the user
    return newUser;
  }

  /**
   * Public method responsible for handling GET request for '/users' endpoint
   */
  public findAll(
    getUserParamDto: GetUsersParamDto,
    limt: number,
    page: number,
  ) {
    throw new HttpException({
      status: HttpStatus.MOVED_PERMANENTLY,
      error: 'The API endpoint does not exist',
      fileName: 'users.service.ts',
      lineNumber: 99
    },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error(),
        description: 'Occured because the API endpoint was permanently moved'
      })
  }

  /**
   * Public method used to find one user using the ID of the user
   */
  public async findOneById(id: number) {

    let user = undefined

    try {
      user = await this.usersRepository.findOneBy({
        id
      })
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process at the moment please try later',
        {
          description: 'Error connecting to the database'
        })
    }

    // Handle the user does not exist
    if (!user) {
      throw new BadRequestException('The user id does not exist.')
    }

    return await this.usersRepository.findOneBy({
      id,
    });
  }

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createMany(createManyUsersDto)
  }
}
