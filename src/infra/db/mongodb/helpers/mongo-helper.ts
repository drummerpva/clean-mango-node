import { Collection, MongoClient } from "mongodb";
const client: MongoClient = null as unknown as MongoClient;
export const MongoHelper = {
  client,
  uri: null as unknown as string,
  async connect(uri: string): Promise<void> {
    this.uri = uri;
    this.client = await MongoClient.connect(uri);
  },
  async disconnect(): Promise<void> {
    if (this.client) await this.client.close();
    this.client = null as unknown as MongoClient;
  },
  async getCollection(name: string): Promise<Collection> {
    if (!this.client) await this.connect(this.uri);
    return this.client.db("jest").collection(name);
  },
  map<Result = any>(data: any): Result {
    if (!data) return null as unknown as Result;
    const { _id, ...dataWithoutId } = data;
    return Object.assign({}, dataWithoutId, { id: _id });
  },
};
