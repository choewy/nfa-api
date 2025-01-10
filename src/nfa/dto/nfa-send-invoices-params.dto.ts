import { ApiProperty } from '@nestjs/swagger';

import { NfaSendInvoicesParamDTO } from './nfa-send-invoices-param.dto';

export class NfaSendInvoicesParamsDTO {
  @ApiProperty({ type: [NfaSendInvoicesParamDTO] })
  rows: NfaSendInvoicesParamDTO[];
}
