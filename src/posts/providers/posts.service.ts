import { PatchPostDto } from './../dtos/patch-post.dto';
import { TagsService } from './../../tags/providers/tags.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { BadRequestException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { User } from 'src/users/user.entity';
import { waitForDebugger } from 'inspector';

@Injectable()
export class PostsService {
  constructor(
    /*
     * Injecting Users Service
     */
    private readonly usersService: UsersService,

    /**
     * Injecting postsRepository
     */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    /**
     * Injecting Tags service
     */
    private readonly tagsService: TagsService,
  ) { }

  /**
   * Method to create a new post
   */
  public async create(createPostDto: CreatePostDto) {
    let author = await this.usersService.findOneById(createPostDto.authorId);

    let tags = await this.tagsService.findMultipleTags(createPostDto.tags);

    // Create the post
    let post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    return await this.postsRepository.save(post);
  }

  /**
   * Method to find all posts
   */
  public async findAll(userId: string) {
    // find all posts
    let posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
        author: true,
        // tags: true,
      },
    });

    return posts;
  }

  /**
   * Method to delete a post from the database
   */
  public async delete(id: number) {
    // Find the post from the database
    await this.postsRepository.delete(id);

    return { deleted: true, id };
  }

  /**
   * Method to Update a post
   */
  public async update(patchPostDto: PatchPostDto) {
    // Find new tags

    let tags = undefined
    let post = undefined

    try {
      //try to find
      tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
    }
    catch (error) {
      // Error
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
      )
    }

    // Number of tags needs to be equal
    if (!tags || tags.lenght !== patchPostDto.tags.length) {
      throw new BadRequestException(
        'Please check your tag Ids and ensure they are correct')
    }

    // Find the post
    try {
      post = await this.postsRepository.findOneBy({
        id: patchPostDto.id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
      )
    }

    if (!post) {
      throw new BadRequestException(
        'Post Id does not exist.')
    }

    // Update the tags
    post.tags = tags;


    // Save the post and return
    try {
      await this.postsRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to precess your request at the moment please try later'
      )
    }

    return post
  }
}
