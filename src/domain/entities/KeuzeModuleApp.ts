export class KeuzeModuleApp {
  id: number;
  name: string;
  shortdescription?: string;
  description?: string;
  content?: string;
  studycredit?: number;
  location?: string;
  contact_id?: number;
  level?: string;
  learningoutcomes?: string;

  constructor(data: Partial<KeuzeModuleApp>) {
    Object.assign(this, data);
  }
}
