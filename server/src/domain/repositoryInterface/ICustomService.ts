import { FilterQuery } from "mongoose";
import { CustomService } from "../entities/customService";


export interface ICustomServiceRepository {
  create(
    data: Omit<CustomService, "id" | "createdAt" | "updatedAt">,
  ): Promise<CustomService>;
  findById(id: string): Promise<CustomService | null>;
  fetchAllService(
    query: FilterQuery<CustomService>,
    skip: number,
    limit: number,
  ): Promise<{ data: CustomService[]; total: number }>;
  updateById(
    id: string,
    data: Partial<Omit<CustomService, "id">>,
  ): Promise<CustomService | null>;
  
  
}
