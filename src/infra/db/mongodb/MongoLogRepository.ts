import { LogRepository } from "../../../application/protocols/LogRepository";
import { MongoHelper } from "./helpers/mongo-helper";

export class MongoLogRepository implements LogRepository {
  async log(stackError: string): Promise<void> {
    const errorColletion = await MongoHelper.getCollection("errors");
    await errorColletion.insertOne({ stackError, date: new Date() });
  }
}
