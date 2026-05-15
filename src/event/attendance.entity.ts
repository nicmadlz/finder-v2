import { UserEntity } from '../auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EventEntity } from './event.entity';
import { Role } from './enums/role.enum';

@Entity('attendance')
export class AttendanceEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @ManyToOne(() => EventEntity, {
    onDelete: 'CASCADE',
  })
  event!: EventEntity;

  @Column({ type: 'enum', enum: Role })
  role!: Role;
}
