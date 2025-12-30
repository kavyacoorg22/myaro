import { Document, FilterQuery, Types } from "mongoose";


export interface IGenericRepository<
T,
D extends Document & {_id:Types.ObjectId}>
{
  findById(id:string):Promise<T|null>;
  findOne(filter:FilterQuery<D>,select?:string):Promise<T|null>
   findMany(filter?: FilterQuery<D>): Promise<T[]>;

  create(data: Omit<T, 'id'|'createdAt'|'updatedAt'>): Promise<T>;

  updateById(
    id: string,
    data: Partial<Omit<T, 'id'>>
  ): Promise<T | null>;

  deleteById(id: string): Promise<boolean>;

}