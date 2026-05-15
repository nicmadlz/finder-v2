import { UserEntity } from '../auth/user.entity';
import { PlaceEntity } from '../place/place.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'timestamp' })
  start_at!: Date;

  @Column()
  duration_minutes!: number;

  @Column()
  max_capacity!: number;

  @ManyToOne(() => PlaceEntity)
  place!: PlaceEntity;

  @ManyToOne(() => UserEntity)
  created_by!: UserEntity;
}
