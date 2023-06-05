import chatStyles from './chat.module.scss';
import { ChatControls } from './ChatControls';
import { ChatWindow } from './ChatWindow';
import { ChatHeader } from './ChatHeader';
import type { ChatMessageProps } from './ChatMessage';
import useFetch from '@hooks/useFetch';
import usePolling from '@hooks/usePolling';
import { GreenApi } from '@api/green_api';
// import { RootState } from '@store/store';
// import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { processNotification } from '../../utils';

export const Chat = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [fetchContactInfo, contactInfoState] = useFetch(GreenApi.getContactInfo, {
    deps: [],
    init: {
      data: null,
      error: null,
      loading: true,
    },
  });
  const [sendMessage, messageState] = useFetch(GreenApi.sendMessage, {
    deps: [],
  });

  usePolling(2000, GreenApi.receiveNotification, (result) => {
    if (result.error !== null || !result.data.success) return;
    const notification = processNotification(parseInt(id!), result.data.data);
    if (!notification.didReceive || !notification.messageInfo.isInCurrentChat) return;
    GreenApi.deleteNotification(notification.messageInfo.receiptId);
    if (notification.messageInfo.type !== 'textMessage') return;
    setMessages((messages) => [...messages, notification.messageInfo.message]);
  });

  useEffect(() => {
    GreenApi.setInstance('1101827286', '59a78a26e66b41a9a432b2f195f8600fe569a91ec3c1462bb3');
    fetchContactInfo(parseInt(id!));
  }, []);

  const onSend = (message: string) => {
    sendMessage(parseInt(id!), message);
    const chatMessage: ChatMessageProps = {
      owner: 'client',
      timestamp: Date.now(),
      text: message,
    };
    setMessages((messages) => [...messages, chatMessage]);
  };

  return (
    <div className={chatStyles.chatContainer}>
      {contactInfoState.loading && <span>Loading</span>}
      {!contactInfoState.loading && !contactInfoState.error && (
        <>
          <ChatHeader
            avatar={contactInfoState.data!.data!.avatar}
            name={contactInfoState.data!.data!.name}
          />
          <ChatWindow messages={messages} />
          <ChatControls onSend={onSend} />
        </>
      )}
    </div>
  );
};
