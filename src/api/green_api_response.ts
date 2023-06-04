import type { ApiMethod } from './methods';

type GetAccStateResponse = {
  stateInstance: 'notAuthorized' | 'authorized' | 'blocked' | 'sleepMode' | 'starting';
};
type CheckWhatsAppResponse = {
  existsWhatsapp: boolean;
};
export type ContactInfo = {
  name: string;
  avatar: string;
};

type ResponseMapping = {
  getAccountState: GetAccStateResponse;
  getContactInfo: ContactInfo;
  checkWhatsApp: CheckWhatsAppResponse;
  sendMessage: any;
};

export type GreenApiResponse<M extends ApiMethod> = ResponseMapping[M];
