import { RecurringException } from "../../../domain/entities/recurringException";
import { IRecurringExceptionRepository } from "../../../domain/repositoryInterface/beautician/IRecurringExceptionRespository";
import { toDateOnly } from "../../../utils/schedule/dateHelper";
import { RecurringExceptionDoc, RecurringExceptionModel } from "../../database/models/beautician/recurringException";
import { GenericRepository } from "../genericRepository";


export class RecurringExceptionRepository extends GenericRepository<RecurringException,RecurringExceptionDoc> implements IRecurringExceptionRepository{
 
  constructor()
  {
    super(RecurringExceptionModel)
  }

  async create(data: Omit<RecurringException, "id" | "createdAt" | "updatedAt">): Promise<RecurringException> {
    const doc=await RecurringExceptionModel.create(data)
    return this.map(doc)
  }

  async findByBeauticianAndDate(beauticianId: string, date: Date): Promise<RecurringException[]> {
  const dateOnly = toDateOnly(date);
    console.log('[ExceptionRepo] looking for exceptions:', { beauticianId, dateOnly });

    const docs = await RecurringExceptionModel.find({
      beauticianId,
      date: dateOnly,
    })
  console.log('[ExceptionRepo] found:', docs.length);

    return docs.map((doc)=>this.map(doc))
  }
  protected map(doc:RecurringExceptionDoc):RecurringException{
  const base=super.map(doc)
  return{
    id:base.id,
    recurringId:doc.recurringId.toString(),
    beauticianId:doc.beauticianId.toString(),
    date:doc.date
  }
  }
  
}