import { KeuzeModuleApp } from '../domain/entities/KeuzeModuleApp';
import { KeuzeModuleAppModel } from '../models/KeuzeModuleAppModel';

export interface IKeuzeModuleAppRepository {
  findAll(): Promise<KeuzeModuleAppModel[]>;
  findById(id: number): Promise<KeuzeModuleAppModel | null>;
  create(item: KeuzeModuleApp): Promise<KeuzeModuleAppModel>;
  update(id: number, item: Partial<KeuzeModuleApp>): Promise<KeuzeModuleAppModel | null>;
  delete(id: number): Promise<boolean>;
}
