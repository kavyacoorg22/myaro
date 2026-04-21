import { IGetBeauticianDashboardOutPut } from "../../interfaceType/beauticianType";

export interface IGetBeauticianDashboardUseCase{
   execute(beauticianId: string): Promise<IGetBeauticianDashboardOutPut>
}