import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsDateString() //2025-01-15T14:30:00
  start_at!: Date;

  @IsInt()
  @Min(15)
  duration_minutes!: number;

  @IsInt()
  @Min(1)
  max_capacity!: number;

  @IsInt()
  place_id!: number;

  @IsString()
  @IsOptional()
  description?: string;
}
