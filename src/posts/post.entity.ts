import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PostType } from './enums/postType.enum';


@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: string;


  @Column()
  title:string
  
    @Column()   
  postType: PostType
}
