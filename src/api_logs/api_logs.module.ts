import { Global, Module } from "@nestjs/common";
import { ApiLogsService } from "./api_logs.service";
import { ApiLogsController } from "./api_logs.controller";

@Global()
@Module({
  providers: [ApiLogsService],
  exports: [ApiLogsService],
  controllers: [ApiLogsController],
})
export class ApiLogsModule {}
