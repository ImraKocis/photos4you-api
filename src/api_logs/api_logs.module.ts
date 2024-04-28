import { Global, Module } from '@nestjs/common';
import { ApiLogsService } from './api_logs.service';

@Global()
@Module({
  providers: [ApiLogsService],
})
export class ApiLogsModule {}
