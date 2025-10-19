import { Controller, Get, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { KeuzeModuleAppService } from '../../application/services/KeuzeModuleAppService';
import { KeuzeModuleAppRoutes } from '../routes/KeuzeModuleAppRoutes';
import { KeuzeModuleApp } from '../../domain/entities/KeuzeModuleApp';

@Controller(KeuzeModuleAppRoutes.base)
export class KeuzeModuleAppKeuzeModuleAppController {
  constructor(private readonly service: KeuzeModuleAppService) {}

  @Get()
  async list() {
    console.log('[KeuzeModuleAppController] GET /keuzemodules called');
    return this.service.list();
  }

  @Get(KeuzeModuleAppRoutes.byId)
  async get(@Param('id', ParseIntPipe) id: number) {
    const item = await this.service.get(id);
    if (!item) throw new NotFoundException();
    return item;
  }
}
