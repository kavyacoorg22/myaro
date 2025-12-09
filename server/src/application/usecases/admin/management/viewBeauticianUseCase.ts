// GetBeauticianProfileUseCase.ts

import { AppError } from "../../../../domain/errors/appError";
import { IBeauticianRepository } from "../../../../domain/repositoryInterface/IBeauticianRepository";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { IBeauticianProfileDTO } from "../../../dtos/beautician";
import { IViewBeauticianDetailsUseCase } from "../../../interface/admin/management/IViewBeauticianDetailsUseCase";
import { toBeauticianProfileDto } from "../../../mapper/beauticianMapper";

export class ViewBeauticianDetailUseCase implements IViewBeauticianDetailsUseCase {
    private _beauticianRepo: IBeauticianRepository;

    constructor(beauticianRepo: IBeauticianRepository) {
        this._beauticianRepo = beauticianRepo;
    }

    async execute(userId: string): Promise<IBeauticianProfileDTO> {
        const beautician = await this._beauticianRepo.findProfileByUserId(userId);
        
        if (!beautician) {
            throw new AppError('Beautician not found', HttpStatus.NOT_FOUND);
        }

        return toBeauticianProfileDto(beautician);
    }
}