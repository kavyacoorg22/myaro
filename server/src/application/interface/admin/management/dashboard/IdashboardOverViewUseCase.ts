import { IDashboardOverviewOutput } from "../../../../interfaceType/adminType";

export interface IGetDashboardOverviewUseCase {
  execute(): Promise<IDashboardOverviewOutput>;
}