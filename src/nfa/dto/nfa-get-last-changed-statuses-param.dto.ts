import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';

export class NfaGetLastChangedStatusesParamDTO {
  @ApiProperty({ type: Date })
  @IsDate()
  startAt: Date;

  @ApiProperty({ type: Date })
  @IsDate()
  endAt: Date;

  @ApiProperty({ type: String })
  @IsString()
  lastChangedType: string;
}
