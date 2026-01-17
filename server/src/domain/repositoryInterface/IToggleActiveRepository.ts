export interface IToggleActiveStatusRepository {
  toggleActive(id: string, isActive: boolean): Promise<boolean>;
}