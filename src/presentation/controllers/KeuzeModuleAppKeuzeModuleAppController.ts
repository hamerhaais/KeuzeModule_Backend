import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
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

  @Post()
  async create(@Body() body: KeuzeModuleApp) {
    return this.service.create(body);
  }

  @Put(KeuzeModuleAppRoutes.byId)
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<KeuzeModuleApp>) {
    const updated = await this.service.update(id, body);
    if (!updated) throw new NotFoundException();
    return updated;
  }

  @Delete(KeuzeModuleAppRoutes.byId)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const ok = await this.service.remove(id);
    if (!ok) throw new NotFoundException();
    return { deleted: ok };
  }
}
