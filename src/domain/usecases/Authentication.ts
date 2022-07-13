/* eslint-disable @typescript-eslint/no-namespace */
export interface Authentication {
  auth(input: Authentication.Input): Promise<string>;
}

export namespace Authentication {
  export type Input = {
    email: string;
    password: string;
  };
}
