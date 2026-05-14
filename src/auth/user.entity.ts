import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './enums/role.enum';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100, nullable: false })
  name!: string;

  @Column({ length: 100, nullable: false, unique: true })
  email!: string;

  @Column({ nullable: false })
  password!: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role!: Role;

  @Column({ type: 'boolean' })
  need_to_change_password = true;
}
