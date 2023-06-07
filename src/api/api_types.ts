import type { ApiMethod } from './methods';

export type ChatID = `${number}@c.us`;

type GetAccStateResponse = {
  stateInstance: 'notAuthorized' | 'authorized' | 'blocked' | 'sleepMode' | 'starting';
};
export type ContactInfo = {
  name: string;
  avatar: string;
};
type CheckWhatsAppResponse = {
  existsWhatsapp: boolean;
};
type SendMessageResponse = {
  idMessage: string;
};
type ReceiveNotificationResponse = {
  receiptId: number;
  body: {
    timestamp: number;
    senderData: {
      chatId: ChatID;
    };
    messageData: {
      typeMessage: 'textMessage'; // since we only care about text messages
      textMessageData: {
        textMessage: string;
      };
    };
  };
} | null;
type DeleteNotificationResponse = {
  result: boolean;
};

type ResponseMapping = {
  getAccountState: GetAccStateResponse;
  getContactInfo: ContactInfo;
  checkWhatsApp: CheckWhatsAppResponse;
  sendMessage: SendMessageResponse;
  receiveNotification: ReceiveNotificationResponse;
  deleteNotification: DeleteNotificationResponse;
};

export type GreenApiResponse<M extends ApiMethod> = ResponseMapping[M];
