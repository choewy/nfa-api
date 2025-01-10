import { ApiProperty } from '@nestjs/swagger';

export class NfaSendInvoicesParamDTO {
  @ApiProperty()
  readonly mallId: string;

  @ApiProperty()
  readonly productOrderId: string;

  @ApiProperty()
  readonly invoice: string;

  @ApiProperty()
  readonly expType: string;

  @ApiProperty()
  readonly expKey: string;
}
