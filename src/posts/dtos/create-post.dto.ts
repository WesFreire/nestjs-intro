import {
  IsArray,
  IsDate,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PostType } from '../enums/postType.enum';
import { PostStatus } from '../enums/postStatus.enum';
import { CreatePostMetaOptionsDto } from './create-post-meta-options.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'This is the title of the post',
    example: 'This is a title',
  })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  title: string;

  @IsEnum(PostType)
  @ApiProperty({
    enum: PostType,
    description: "Possible values, 'post', 'page', 'story', 'series'",
  })
  @IsNotEmpty()
  postType: PostType;

  @ApiProperty({
    description: " For Exemple - 'my-url'",
    example: "'by-blog-post'",
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'A slug should be all small letters and uses only "-" and without spaces. For example "my-url"',
  })
  slug: string;

  @ApiProperty({
    enum: PostStatus,
    description: " Possible values 'draft', 'scheduled'. 'review', 'published'",
  })
  @IsEnum(PostStatus)
  @IsNotEmpty()
  status: PostStatus;

  @ApiPropertyOptional({
    description: 'This is the content of the post',
    example: 'The post content',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    description:
      'Serialize your JSON object else a alidation error will be thrown',
    example:
      '{\r\n "@context": "https:\/\/schema.org",\r\n "@type": "Person"\r\n }', // eslint-disable-line no-useless-escape
  })
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: 'Featured image for your blog post',
    example: ' http://localhost.com/images/image1.jpg',
  })
  @IsOptional()
  @IsUrl()
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: ' The date on which the blog post was posted',
    example: '2026-03-16T07:46:32+0000',
  })
  @IsISO8601()
  @IsOptional()
  publishOn?: Date;

  @ApiPropertyOptional({
    description: ' Array of tags passed as string of values',
    example: ['nestjs', 'typescript'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags?: string[];

  @ApiPropertyOptional({
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description:
            'The key can be a string indentifier for your meta option',
          example: 'sidebarEnabled',
        },
        value: {
          type: 'any',
          description: 'Any value that you want to sabe to the key',
          example: true,
        },
      },
    },
    description: ' ',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto[];
}
