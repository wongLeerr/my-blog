// 此文件为操纵数据库中user_auths表的文件
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import {User} from './users'

@Entity({ name: 'user_auths' })

export class UserAuth extends BaseEntity{
    @PrimaryGeneratedColumn()
    readonly id!: number;

    @Column()
    identity_type!: string;

    @Column()
    identifier!: string;

    @Column()
    credential!: string;

    @ManyToOne(() => User, {
        cascade:true
    })

    @JoinColumn({ name: 'user_id' })
    user!:User


}