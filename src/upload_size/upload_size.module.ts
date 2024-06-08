import { Module } from "@nestjs/common";
import { UploadSizeService } from "./upload_size.service";
import { UploadSizeController } from "./upload_size.controller";

@Module({
  providers: [UploadSizeService],
  controllers: [UploadSizeController],
})
export class UploadSizeModule {}
