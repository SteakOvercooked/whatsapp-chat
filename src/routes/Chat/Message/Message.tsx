import classnames from 'classnames';
import { getMessageTime } from '../../../utils';
import messageStyles from './message.module.scss';
import { forwardRef } from 'react';

export type MessageProps = {
  timestamp: number;
  owner: 'client' | 'contact';
  text: string;
};

export const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ timestamp, owner, text }: MessageProps, ref) => {
    const time = getMessageTime(timestamp);
    return (
      <div
        className={classnames(messageStyles.messageBlock, owner === 'client' && messageStyles.own)}>
        <div ref={ref} className={messageStyles.message}>
          <div className={messageStyles.messageContent}>
            {text}
            <span className={messageStyles.time}>{time}</span>
          </div>
        </div>
      </div>
    );
  }
);
