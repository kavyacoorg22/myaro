import { NextFunction, Request, Response } from "express";
import { IGetBookingTrendUSeCase } from "../../../../application/interface/admin/management/dashboard/getBookingTrendUseCase";
import { IGetRevenueUSeCase } from "../../../../application/interface/admin/management/dashboard/getRevenueStatus";
import { IGetUserGrowthUSeCase } from "../../../../application/interface/admin/management/dashboard/getUserGrowthUseCase";
import { IGetDashboardOverviewUseCase } from "../../../../application/interface/admin/management/dashboard/IdashboardOverViewUseCase";
import { HttpStatus } from "../../../../shared/enum/httpStatus";

export class DashboardController {
  constructor(
    private readonly _getOverviewUC:IGetDashboardOverviewUseCase,
    private readonly _getUserGrowthUC:IGetUserGrowthUSeCase,
    private readonly _getBookingTrendUC:IGetBookingTrendUSeCase,
    private readonly _getRevenueUC: IGetRevenueUSeCase,
  ) {}

  getOverView=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
     try{
         const result=await this._getOverviewUC.execute()
         res.status(HttpStatus.OK).json({
          sucess:true,
          data:result.data
         })

     }catch(err)
     {
      next(err)
     }
  }
   getUserGrowth=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
     try{
      const year=Number(req.query?.year)
         const result=await this._getUserGrowthUC.execute(year)
         res.status(HttpStatus.OK).json({
          sucess:true,
          data:result.data
         })

     }catch(err)
     {
      next(err)
     }
  }
   getBookingTrend=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
     try{
    const year=Number(req.query?.year)
         const result=await this._getBookingTrendUC.execute(year)
         res.status(HttpStatus.OK).json({
          sucess:true,
          data:result.data
         })
     }catch(err)
     {
      next(err)
     }
  }
   getRevenue=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
     try{
         const result=await this._getRevenueUC.execute()
         res.status(HttpStatus.OK).json({
          sucess:true,
          data:result.data
         })
     }catch(err)
     {
      next(err)
     }
  }
}