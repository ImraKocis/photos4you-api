import { Controller, ForbiddenException, Get, UseGuards } from "@nestjs/common";
import { JwtGuard } from "../auth/guard";
import { GetCurrentUserRole } from "../auth/decorator";
import { Log, Role } from "@prisma/client";
import { ApiLogsService } from "./api_logs.service";

@Controller("logs")
export class ApiLogsController {
  constructor(private apiLogsService: ApiLogsService) {}

  @UseGuards(JwtGuard)
  @Get()
  async findAll(@GetCurrentUserRole() role: Role): Promise<Log[]> {
    if (role === "ADMIN") return this.apiLogsService.getLogs();
    throw new ForbiddenException("Forbidden action");
  }
}
