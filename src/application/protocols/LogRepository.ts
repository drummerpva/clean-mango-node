export interface LogRepository {
  log(stackError: string): Promise<void>;
}
