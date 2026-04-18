import { AppError } from "../../../../domain/errors/appError";
import { IRecurringExceptionRepository } from "../../../../domain/repositoryInterface/beautician/IRecurringExceptionRespository";
import { IReccuringScheduleRepository } from "../../../../domain/repositoryInterface/beautician/IRecurringScheduleRepository";
import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { IDeleteRecurringAvailabilitySlotUseCase } from "../../../interface/beautician/schedule/IDeleteRecurringAvailabilitySlotUseCase";
import { IDeleteRecursionScheduleInput } from "../../../interfaceType/scheduleType";


export class DeleteRecurringAvailabilityUseCase implements IDeleteRecurringAvailabilitySlotUseCase{
  constructor(private _userRepo:IUserRepository,
    private _recurringExceptionRepo:IRecurringExceptionRepository,
    private _recurringScheduleRepo:IReccuringScheduleRepository
  ){}

  async execute(beauticianId: string, input: IDeleteRecursionScheduleInput): Promise<void> {
    const {recurringId,date}=input
    const beautician=await this._userRepo.findByUserId(beauticianId)
    if(!beautician)
    {
      throw new AppError(authMessages.ERROR.UNAUTHORIZED,HttpStatus.UNAUTHORIZED)
    }
      const rule = await this._recurringScheduleRepo.findById(recurringId);
    if (!rule || rule.beauticianId !== beauticianId) {
      throw new AppError(generalMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

   
    await this._recurringExceptionRepo.create({
      recurringId,
      beauticianId,
      date,
    });
  }
}