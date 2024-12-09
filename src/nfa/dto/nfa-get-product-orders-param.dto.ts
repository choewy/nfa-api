import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';

export class NfaGetProductOrdersParamDTO {
  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  productOrderIds?: string[];

  @ApiPropertyOptional({ type: Date })
  @IsDate()
  startAt?: Date;

  @ApiPropertyOptional({ type: Date })
  @IsDate()
  endAt?: Date;

  @ApiPropertyOptional({ type: String })
  @IsString()
  lastChangedType?: string;
}
