import { Controller, Get, UseGuards } from "@nestjs/common";
import { UploadSizeService } from "./upload_size.service";
import { JwtGuard } from "../auth/guard";

@Controller("upload-size")
export class UploadSizeController {
  constructor(private uploadSizeService: UploadSizeService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getUploadSize() {
    return await this.uploadSizeService.getAll();
  }
}
