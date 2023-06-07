import { ChatID, GreenApiResponse } from '@api/api_types';
import type { MessageProps } from './routes/Chat/Message';

export function getChatID(id: number): ChatID {
  return `${id}@c.us`;
}

export function getMessageTime(timestamp: number) {
  const messageDate = new Date(timestamp * 1000);
  const hour = messageDate.getHours();
  const minute = messageDate.getMinutes();

  return `${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}`;
}

type ReceivedMessageInfo = {
  receiptId: number;
  isInCurrentChat: boolean;
  type: string;
  message: MessageProps;
};
type Notification =
  | {
      didReceive: false;
      messageInfo: null;
    }
  | {
      didReceive: true;
      messageInfo: ReceivedMessageInfo;
    };

export function processNotification(
  id: number,
  notification: GreenApiResponse<'receiveNotification'>
): Notification {
  if (notification === null) return { didReceive: false, messageInfo: null };
  const { messageData, senderData, timestamp } = notification.body;
  const messageInfo: ReceivedMessageInfo = {
    receiptId: notification.receiptId,
    type: messageData.typeMessage,
    isInCurrentChat: senderData.chatId === getChatID(id),
    message: {
      owner: 'contact',
      timestamp: timestamp,
      text:
        messageData.typeMessage === 'textMessage' ? messageData.textMessageData.textMessage : '',
    },
  };
  return { didReceive: true, messageInfo };
}

export function purifyPhone(phone: string): string {
  let pure = '';
  for (let char = 0; char < phone.length; char++)
    if (phone.charCodeAt(char) >= 48 && phone.charCodeAt(char) <= 57) pure += phone[char];
  return pure;
}
