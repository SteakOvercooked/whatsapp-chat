import chatStyles from './chat.module.scss';
import { Controls } from './Controls';
import { Window } from './Window';
import { Header } from './Header';
import type { MessageProps } from './Message';
import useFetch from '@hooks/useFetch';
import usePolling from '@hooks/usePolling';
import { GreenApi } from '@api/green_api';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { processNotification } from '../../utils';
import { Loading } from './Loading';

export const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<MessageProps[]>([]);
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
    if (!GreenApi.isInstantiated()) navigate('../../', { replace: true });
    fetchContactInfo(parseInt(id!));
  }, []);

  const onSend = (message: string) => {
    sendMessage(parseInt(id!), message);
    const chatMessage: MessageProps = {
      owner: 'client',
      timestamp: Date.now(),
      text: message,
    };
    setMessages((messages) => [...messages, chatMessage]);
  };

  return (
    <div className={chatStyles.chatContainer}>
      {contactInfoState.loading && <Loading />}
      {!contactInfoState.loading && !contactInfoState.error && (
        <>
          <Header
            avatar={contactInfoState.data!.data!.avatar}
            name={contactInfoState.data!.data!.name}
          />
          <Window messages={messages} />
          <Controls onSend={onSend} />
        </>
      )}
    </div>
  );
};
