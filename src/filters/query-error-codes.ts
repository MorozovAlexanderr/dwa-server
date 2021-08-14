interface IQueryErrorCodes {
  [errorKey: string]: string;
}

export const QueryErrorCodes: IQueryErrorCodes = {
  ER_DUP_ENTRY: 'error.unique',
};
