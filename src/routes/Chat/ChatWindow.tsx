import windowStyles from './chat_window.module.scss';
import { ChatMessage } from './ChatMessage';
import type { ChatMessageProps } from './ChatMessage';

type ChatWindowProps = {
  messages: ChatMessageProps[];
};

export const ChatWindow = ({ messages }: ChatWindowProps) => {
  return (
    <div className={windowStyles.window}>
      <div className={windowStyles.content}>
        {messages.map((message) => (
          <ChatMessage {...message} />
        ))}
      </div>
    </div>
  );
};
