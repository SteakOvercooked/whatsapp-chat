import classnames from 'classnames';
import { getMessageTime } from '../../utils';
import messageStyles from './chat_message.module.scss';

export type ChatMessageProps = {
  timestamp: number;
  owner: 'client' | 'contact';
  text: string;
};

export const ChatMessage = ({ timestamp, owner, text }: ChatMessageProps) => {
  const time = getMessageTime(timestamp);
  return (
    <div
      className={classnames(messageStyles.messageBlock, owner === 'client' && messageStyles.own)}>
      <div className={messageStyles.message}>
        <div className={messageStyles.messageContent}>
          {text}
          <span className={messageStyles.time}>{time}</span>
        </div>
      </div>
    </div>
  );
};
