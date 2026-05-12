import { ConflictException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { DataSource } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(
    /**
     * Inject DataSource
     */
    private readonly dataSource: DataSource
  ) { }

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    let newUsers: User[] = []

    // Create Query Runner Instance 
    const queryRunner = this.dataSource.createQueryRunner()

    try {

      // Connect Query Runner to 
      await queryRunner.connect()

      // Start Transaction
      await queryRunner.startTransaction()
    } catch (error) {
      throw new RequestTimeoutException('Could not connect to the database')
    }

    try {
      for (let user of createManyUsersDto.users) {
        let newUser = queryRunner.manager.create(User, user)
        let result = await queryRunner.manager.save(newUser)
        newUsers.push(result)
      }

      // If successful commit
      await queryRunner.commitTransaction()

    } catch (error) {
      // If unsuccessful rollback
      await queryRunner.rollbackTransaction()
      throw new ConflictException('Could not complete the transaction',{
        description: String(error)
      })

    } finally {
      try {
        // you need to release a queryRunner which was manually instantiated
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException(
          'Could not release the query runner connection',
        );
      }
    }

    return newUsers
  }
}
