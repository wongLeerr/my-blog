// 此文件为操纵数据库中users表的文件
import { Entity, BaseEntity,ManyToOne ,PrimaryGeneratedColumn, JoinColumn ,Column, OneToMany, ManyToMany } from 'typeorm'
import { User } from './users'
import { Comment } from './comment';
import { Tag } from './tag';

@Entity({ name: 'articles' })

export class Article extends BaseEntity{
    @PrimaryGeneratedColumn()
    readonly id!: number;

    @Column()
    title!: string;

    @Column()
    content!: string;

    @Column()
    views!: number;

    @Column()
    create_time!: Date;

    @Column()
    update_time!: Date;

    @Column()
    is_delete!: number;

    @ManyToMany(() => Tag, (tag) => tag.articles, {
        cascade:true
    })
    tags!:Tag[]

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user!: User
    
    @OneToMany(() => Comment, (comment) => comment.article)
    comments!:Comment[]

}