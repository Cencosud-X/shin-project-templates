import { Controller, Get } from "@nestjs/common";

import { HealthService } from "./health.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@Controller()
@ApiTags("Health")
export class HealthController {
  constructor(private readonly service: HealthService) {}

  @Get("health")
  @ApiOperation({ summary: "Get full Trace of an operation by RequestID" })
  health() {
    return this.service.health();
  }

  @Get("ping")
  @ApiOperation({ summary: "Get proccess ping info" })
  ping() {
    return this.service.ping();
  }
}

export default HealthController;
