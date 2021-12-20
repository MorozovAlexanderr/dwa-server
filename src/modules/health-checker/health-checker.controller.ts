import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthCheckerController {
  constructor(
    private readonly _healthCheckService: HealthCheckService,
    private readonly _typeOrmHealthIndicator: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this._healthCheckService.check([
      () => this._typeOrmHealthIndicator.pingCheck('database'),
    ]);
  }
}
