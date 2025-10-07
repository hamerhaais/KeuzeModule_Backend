import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { KeuzeModuleApp } from '../../domain/entities/KeuzeModuleApp';
import { KeuzeModuleAppModel } from '../../models/KeuzeModuleAppModel';
import { KeuzeModuleAppRepository } from '../../repositories/KeuzeModuleAppRepository';

@Injectable()
export class KeuzeModuleAppService {
  private repo: KeuzeModuleAppRepository;

  constructor() {
    this.repo = new KeuzeModuleAppRepository();
  }

  async list(): Promise<KeuzeModuleAppModel[]> {
    try {
      return await this.repo.findAll();
    } catch (err) {
      throw new HttpException('Database unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async get(id: number): Promise<KeuzeModuleAppModel | null> {
    try {
      return await this.repo.findById(id);
    } catch (err) {
      throw new HttpException('Database unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async create(data: KeuzeModuleApp): Promise<KeuzeModuleAppModel> {
    try {
      return await this.repo.create(data);
    } catch (err) {
      throw new HttpException('Database unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async update(id: number, data: Partial<KeuzeModuleApp>): Promise<KeuzeModuleAppModel | null> {
    try {
      return await this.repo.update(id, data);
    } catch (err) {
      throw new HttpException('Database unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      return await this.repo.delete(id);
    } catch (err) {
      throw new HttpException('Database unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
