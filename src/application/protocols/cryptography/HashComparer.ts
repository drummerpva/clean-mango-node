export interface HashComparer {
  compare(value: string): Promise<boolean>;
}
