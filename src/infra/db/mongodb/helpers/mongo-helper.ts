import { Collection, MongoClient } from "mongodb";
const client: MongoClient = null as unknown as MongoClient;
export const MongoHelper = {
  client,
  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri);
  },
  async disconnect(): Promise<void> {
    await this.client.close();
  },
  getCollection(name: string): Collection {
    return this.client.db("jest").collection(name);
  },
};
