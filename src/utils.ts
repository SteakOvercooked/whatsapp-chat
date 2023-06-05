import { ChatID, GreenApiResponse } from '@api/api_types';
import { ChatMessageProps } from './routes/Chat/ChatMessage';

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
  message: ChatMessageProps;
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
  const body = notification.body;
  const messageInfo: ReceivedMessageInfo = {
    receiptId: notification.receiptId,
    type: body.messageData.typeMessage,
    isInCurrentChat: body.senderData.chatId === getChatID(id),
    message: {
      owner: 'contact',
      timestamp: body.timestamp,
      text: body.messageData.textMessageData.textMessage,
    },
  };
  return { didReceive: true, messageInfo };
}
