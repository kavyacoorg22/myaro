import { AppError } from "../../../domain/errors/appError";
import { IBookingRepository } from "../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { appConfig } from "../../../infrastructure/config/config";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { timeToMinutes } from "../../../utils/schedule/dateHelper";
import { ILockSlotUSeCase } from "../../interface/booking/ILockSlotUseCase";
import { ILockSlotInput } from "../../interfaceType/booking";
import { ILockSlotService } from "../../serviceInterface/ILockSlotService";

export class LockSlotUseCase implements ILockSlotUSeCase{
  constructor(private _bookingRepo:IBookingRepository,private _lockSlotService:ILockSlotService){}

  async execute(input: ILockSlotInput): Promise<{ ttl: number; }> {
        const { beauticianId, date, startTime, endTime, userId } = input;

    const startMinutes = timeToMinutes(startTime);
    const endMinutes   = timeToMinutes(endTime);
    //checks overlap
    const overlapping = await this._bookingRepo.findOverlapping({
      beauticianId,
      date: new Date(date),
      startMinutes,
      endMinutes,
    });

    if (overlapping) {
      throw new AppError("This slot is already booked", HttpStatus.CONFLICT);
    }

  
const key = `lock:${beauticianId}:${date}:${startTime}-${endTime}`;
    const ttl = appConfig.redis.redisLockSlotTtl * 60; 

    const acquired = await this._lockSlotService.setNX(key, userId, ttl);

    if (!acquired) {
      // Check if same user already holds the lock
      const existing = await this._lockSlotService.get(key);
      if (existing === userId) {
        // Same user — refresh TTL
        await this._lockSlotService.expire(key, ttl);
        return { ttl };
      }
      throw new AppError("Slot is temporarily reserved by another user", HttpStatus.CONFLICT);
    }

    return { ttl };
  }

}