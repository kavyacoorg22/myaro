import { CustomService } from "../entities/customService";

export interface ICustomServiceRepository {
  create(
    data: Omit<CustomService, "id" | "createdAt" | "updatedAt">,
  ): Promise<CustomService>;
  findById(id: string): Promise<CustomService | null>;
  fetchAllService(
    query: any,
    skip: number,
    limit: number,
  ): Promise<{ data: CustomService[]; total: number }>;
  updateById(
    id: string,
    data: Partial<Omit<CustomService, "id">>,
  ): Promise<CustomService | null>;
}
