import { Controller, Get } from "@nestjs/common"
import type { AppService } from "./app.service"
import { Public } from "./common/decorators/public.decorator"
import { ApiExcludeEndpoint } from "@nestjs/swagger"

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @ApiExcludeEndpoint()
  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
