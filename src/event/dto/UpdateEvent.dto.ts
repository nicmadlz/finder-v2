import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsDateString()
  @IsOptional()
  start_at?: Date;

  @IsInt()
  @Min(15)
  @IsOptional()
  duration_minutes?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  max_capacity?: number;

  @IsString()
  @IsOptional()
  description?: string;
}
