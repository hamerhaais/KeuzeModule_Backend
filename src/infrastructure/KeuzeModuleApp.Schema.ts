import { KeuzeModuleAppModel } from '../models/KeuzeModuleAppModel';

// The actual collection in the provided MongoDB export is named "KeuzeModuleApp".
// Keep this file as the single source-of-truth for the collection name.
export const collectionName = 'KeuzeModuleApp';

export function toModel(doc: any): KeuzeModuleAppModel {
  return {
    _id: doc._id,
    id: doc.id,
    name: doc.name,
    shortdescription: doc.shortdescription,
    description: doc.description,
    content: doc.content,
    studycredit: doc.studycredit,
    location: doc.location,
    contact_id: doc.contact_id,
    level: doc.level,
    learningoutcomes: doc.learningoutcomes,
  };
}
