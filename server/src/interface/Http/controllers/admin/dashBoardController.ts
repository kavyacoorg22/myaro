import { Request, Response } from "express";
import { IGetBookingTrendUSeCase } from "../../../../application/interface/admin/management/dashboard/getBookingTrendUseCase";
import { IGetRevenueUSeCase } from "../../../../application/interface/admin/management/dashboard/getRevenueStatus";
import { IGetUserGrowthUSeCase } from "../../../../application/interface/admin/management/dashboard/getUserGrowthUseCase";
import { IGetDashboardOverviewUseCase } from "../../../../application/interface/admin/management/dashboard/IdashboardOverViewUseCase";
import { HttpStatus } from "../../../../shared/enum/httpStatus";

export class DashboardController {
  constructor(
    private readonly _getOverviewUseCase: IGetDashboardOverviewUseCase,
    private readonly _getUserGrowthUseCase: IGetUserGrowthUSeCase,
    private readonly _getBookingTrendUseCase: IGetBookingTrendUSeCase,
    private readonly _getRevenueUseCase: IGetRevenueUSeCase,
  ) {}

  getOverView = async (req: Request, res: Response): Promise<void> => {
    const result = await this._getOverviewUseCase.execute();
    res.status(HttpStatus.OK).json({
      sucess: true,
      data: result.data,
    });
  };
  getUserGrowth = async (req: Request, res: Response): Promise<void> => {
    const year = Number(req.query?.year);
    const result = await this._getUserGrowthUseCase.execute(year);
    res.status(HttpStatus.OK).json({
      sucess: true,
      data: result.data,
    });
  };
  getBookingTrend = async (req: Request, res: Response): Promise<void> => {
    const year = Number(req.query?.year);
    const result = await this._getBookingTrendUseCase.execute(year);
    res.status(HttpStatus.OK).json({
      sucess: true,
      data: result.data,
    });
  };
  getRevenue = async (req: Request, res: Response): Promise<void> => {
    const result = await this._getRevenueUseCase.execute();
    res.status(HttpStatus.OK).json({
      sucess: true,
      data: result.data,
    });
  };
}
