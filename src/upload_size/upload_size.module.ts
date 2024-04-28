import { Module } from '@nestjs/common';
import { UploadSizeService } from './upload_size.service';

@Module({
  providers: [UploadSizeService],
})
export class UploadSizeModule {}
