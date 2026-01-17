import { NextFunction, Request, Response } from "express";
import { IAddServiceUseCase } from "../../../../application/interface/admin/management/services/IAddService";
import { IGetServicesUseCase } from "../../../../application/interface/admin/management/services/IGetServices";
import { ITogggleActiveStatusUseCase } from "../../../../application/interface/admin/management/services/IToggleActiveStatus";
import { IUpdateServiceUseCase } from "../../../../application/interface/admin/management/services/IUpdateService";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { AppError } from "../../../../domain/errors/appError";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";

export class ServiceController {
  private _addServiceUC: IAddServiceUseCase;
  private _updateServiceUC: IUpdateServiceUseCase;
  private _getAllServiceUC: IGetServicesUseCase;
  private _toggleActiveStatusUC: ITogggleActiveStatusUseCase;
  constructor(
    addServiceUC: IAddServiceUseCase,
    updateServiceUC: IUpdateServiceUseCase,
    getAllServiceUC: IGetServicesUseCase,
    toggleActiveStatusUC: ITogggleActiveStatusUseCase
  ) {
    (this._addServiceUC = addServiceUC),
      (this._updateServiceUC = updateServiceUC),
      (this._getAllServiceUC = getAllServiceUC),
      (this._toggleActiveStatusUC = toggleActiveStatusUC);
  }

  addService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, categoryId } = req.body;

      if (!name || !categoryId) {
        throw new AppError(
          generalMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST
        );
      }

      const input = { name, categoryId };
      await this._addServiceUC.execute(input);

      res.status(HttpStatus.CREATED).json({
        success: true,
        message:"Service added" ,
      });
    } catch (err) {
      next(err);
    }
  };

   updateService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {name}=req.body
        const id=req.params.id
        if(!id)
        {
          throw new AppError(generalMessages.ERROR.BAD_REQUEST,HttpStatus.BAD_REQUEST)
        }
        await this._updateServiceUC.execute(id,name)
        res.status(HttpStatus.OK).json({
          success:true,
          message:"service updated"
        })
    }catch(err)
    {
      next(err)
    }
  }
  getServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {categoryId}=req.body
      if(!categoryId)
      {
        throw new AppError(generalMessages.ERROR.BAD_REQUEST,HttpStatus.BAD_REQUEST)
      }
      const result=await this._getAllServiceUC.execute(categoryId)
       res.status(HttpStatus.OK).json({
          success:true,
          message:"services fetched",
          data:result
        })
    }catch(err)
    {
      next(err)
    }
  }
  toggleServiceStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {isActive}=req.body
      const id=req.params.id
      if(!id)
      {
        throw new AppError(generalMessages.ERROR.BAD_REQUEST,HttpStatus.BAD_REQUEST)
      }

      if(typeof isActive!=='boolean')
      {
        throw new AppError(generalMessages.ERROR.BAD_REQUEST,HttpStatus.BAD_REQUEST)
      }

      await this._toggleActiveStatusUC.execute(id,isActive)
        res.status(HttpStatus.OK).json({
          success:true,
          message:"Status Changed",
        })

    }catch(err)
    {
      next(err)
    }
  }
}
