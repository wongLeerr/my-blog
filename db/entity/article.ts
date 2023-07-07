// 此文件为操纵数据库中users表的文件
import { Entity, BaseEntity,ManyToOne ,PrimaryGeneratedColumn, JoinColumn ,Column } from 'typeorm'
import  {User }  from './users'

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

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user!:User


}