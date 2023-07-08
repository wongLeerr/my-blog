// 此文件为操纵数据库中users表的文件
import { Entity, BaseEntity,ManyToOne ,PrimaryGeneratedColumn, JoinColumn ,Column } from 'typeorm'
import { User } from './users'
import { Article } from './article';

@Entity({ name: 'comments' })

export class Comment extends BaseEntity{
    @PrimaryGeneratedColumn()
    readonly id!: number;

    @Column()
    content!: string;

    @Column()
    create_time!: Date;

    @Column()
    update_time!: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user!: User
    
    @ManyToOne(() => Article)
    @JoinColumn({ name: 'article_id' })
    article!:Article

}