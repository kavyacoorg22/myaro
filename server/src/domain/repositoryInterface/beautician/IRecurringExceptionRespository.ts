import { RecurringException } from "../../entities/recurringException";

export interface IRecurringExceptionRepository {
  create(data: Omit<RecurringException, "id" | "createdAt" | "updatedAt">): Promise<RecurringException>;
  findByBeauticianAndDate(beauticianId: string, date: Date): Promise<RecurringException[]>;
}