import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  score?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  success?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  unsuccess?: number;
}