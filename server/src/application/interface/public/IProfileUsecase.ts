import { IOwnProfileOutput } from "../../interfaceType/publicType";

export interface IOwnProfileUseCase {
  execute(targetId: string, requesterId?: string): Promise<IOwnProfileOutput>;
}
