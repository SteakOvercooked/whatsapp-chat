import type { ApiMethod } from './methods';

type GetAccStateResponse = {
  stateInstance: 'notAuthorized' | 'authorized' | 'blocked' | 'sleepMode' | 'starting';
};

type ResponseMapping = {
  getAccountState: GetAccStateResponse;
  getContactInfo: any;
  checkWhatsApp: any;
  sendMessage: any;
};

export type GreenApiResponse<M extends ApiMethod> = ResponseMapping[M];
