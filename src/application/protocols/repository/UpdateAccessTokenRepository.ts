export interface UpdateAccessTokenRepository {
  updateTokenById(id: string, token: string): Promise<void>;
}
