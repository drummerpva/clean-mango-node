/* eslint-disable @typescript-eslint/no-namespace */
export interface Authentication {
  auth(email: string, password: string): Promise<Authentication.Output>;
}

export namespace Authentication {
  export type Output = {
    accessToken: string;
  };
}
