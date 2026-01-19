import {
  CustomServiceFilter,
  CustomServiceStatus,
} from "../../../../../domain/enum/serviceEnum";
import { AppError } from "../../../../../domain/errors/appError";
import { ICustomServiceRepository } from "../../../../../domain/repositoryInterface/ICustomService";
import { IUserRepository } from "../../../../../domain/repositoryInterface/IUserRepository";
import { generalMessages } from "../../../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IGetAllCustomServiceUseCase } from "../../../../interface/beauticianService/IGetCustomService";
import { IGetAllCustomServiceResponse } from "../../../../interfaceType/serviceType";
import { toGetAllCustomServiceDto } from "../../../../mapper/serviceMapper";

export class GetAllCustomServiceUSeCase implements IGetAllCustomServiceUseCase {
  private _customserviceRepo: ICustomServiceRepository;
  private _userRepo: IUserRepository;

  constructor(
    customServiceRepo: ICustomServiceRepository,
    userRepo: IUserRepository,
  ) {
    this._customserviceRepo = customServiceRepo;
    this._userRepo = userRepo;
  }
  async execute(
    page: number,
    limit: number,
    filter: CustomServiceFilter,
  ): Promise<IGetAllCustomServiceResponse> {
    const skip = (page - 1) * limit;

    const query: any = {
      status: CustomServiceStatus.PENDING,
    };

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    if (filter === "today") {
      query.createdAt = {
        $gte: startOfToday,
        $lte: endOfToday,
      };
    }

    if (filter === "yesterday") {
      const start = new Date(startOfToday);
      start.setDate(start.getDate() - 1);

      const end = new Date(endOfToday);
      end.setDate(end.getDate() - 1);

      query.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    if (filter === "earlier") {
      const beforeYesterday = new Date(startOfToday);
      beforeYesterday.setDate(beforeYesterday.getDate() - 1);

      query.createdAt = {
        $lt: beforeYesterday,
      };
    }

    const { data, total } = await this._customserviceRepo.fetchAllService(
      query,
      skip,
      limit,
    );
    if (!data) {
      throw new AppError(generalMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const BeauticianData = await this._userRepo.findUsersByIds(
      data.map((ele) => ele.beauticianId),
    );

    const beauticianMap = new Map(BeauticianData.map((u) => [u.id, u]));

    const mapped = data.map((b) =>
      toGetAllCustomServiceDto(b, beauticianMap.get(b.beauticianId)),
    );
    return {
      customService: mapped,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
