import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class UserEntity {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ length: 100, nullable: false })
    name!: string;

    @Column({ length: 100, nullable: false, unique: true })
    email!: string;

    @Column({ nullable: false })
    password!: string;
}