import multer from 'multer';
import type { Field } from 'multer';

const memoryStorage = multer.memoryStorage();


const uploadConfig: Record<string, number> = {
  portfolioImage: 10,
  certificateImage: 5,
  shopPhotos: 5,
  shopLicence: 2,
  profilePhoto: 1,
};

export const uploadFields = (fields: string[]) => {
  const mappedFields: Field[] = fields.map(name => ({
    name,
    maxCount: uploadConfig[name] || 1
  }));

  return multer({ 
    storage: memoryStorage,
    limits: {
      fileSize: 5 * 1024 * 1024 
    }
  }).fields(mappedFields);
};


export const uploadFieldsWithConfig = (config: Record<string, number>) => {
  const mappedFields: Field[] = Object.entries(config).map(([name, maxCount]) => ({
    name,
    maxCount
  }));

  return multer({ 
    storage: memoryStorage,
    limits: {
      fileSize: 5 * 1024 * 1024
    }
  }).fields(mappedFields);
};


export const uploadSingle = (fieldName: string) => {
  return multer({ 
    storage: memoryStorage,
    limits: {
      fileSize: 5 * 1024 * 1024
    }
  }).single(fieldName);
};


export const uploadArray = (fieldName: string, maxCount: number = 10) => {
  return multer({ 
    storage: memoryStorage,
    limits: {
      fileSize: 5 * 1024 * 1024
    }
  }).array(fieldName, maxCount);
};