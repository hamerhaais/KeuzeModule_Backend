export class Enrollment {
  _id?: any;
  userId!: string; // from JWT sub
  moduleId!: number; // KeuzeModuleApp.id
  firstChoice: boolean = false;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  constructor(data: Partial<Enrollment>) {
    Object.assign(this, data);
  }
}
