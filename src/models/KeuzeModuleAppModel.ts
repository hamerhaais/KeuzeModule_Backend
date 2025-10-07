export interface KeuzeModuleAppModel {
  _id?: any; // mongodb ObjectId
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
}
