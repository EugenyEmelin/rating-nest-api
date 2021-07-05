import { Type } from 'class-transformer';
import { TopLevelCategory } from '../top-page.model';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class hhDataDto {
  @IsNumber()
  count: number;

  @IsNumber()
  juniorSalary: number;

  @IsNumber()
  middleSalary: number;

  @IsNumber()
  seniorSalary: number;
}

class TopPageAdvantageDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class CreateTopPageDto {
  @IsEnum(TopLevelCategory)
  firstLevelCategory: TopLevelCategory;

  @IsString()
  secondCategory: string;

  @IsString()
  title: string;

  @IsString()
  category: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => hhDataDto)
  hh?: hhDataDto;

  @IsArray()
  @ValidateNested()
  @Type(() => TopPageAdvantageDto)
  advantages: TopPageAdvantageDto[];

  @IsString()
  seoText: string;

  @IsString()
  tagsTitle: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
