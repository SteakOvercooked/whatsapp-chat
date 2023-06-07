import windowStyles from './window.module.scss';
import { Message } from '../Message';
import type { MessageProps } from '../Message';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { createRef, useEffect, useRef } from 'react';

type WindowProps = {
  messages: MessageProps[];
};

export const Window = ({ messages }: WindowProps) => {
  const windowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const chatWindow = windowRef.current;
    if (chatWindow && chatWindow.scrollHeight > chatWindow.clientHeight)
      chatWindow.scrollTo({
        top: chatWindow.scrollHeight,
        behavior: 'smooth',
      });
  });

  return (
    <div className={windowStyles.window} ref={windowRef}>
      <div className={windowStyles.content}>
        <TransitionGroup>
          {messages.map((message) => {
            const ref = createRef<HTMLDivElement>();
            return (
              <CSSTransition
                key={message.timestamp}
                timeout={200}
                nodeRef={ref}
                classNames={{
                  enter: windowStyles.messageItemEnter,
                  enterActive: windowStyles.messageItemEnterActive,
                }}>
                <Message ref={ref} {...message} />
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </div>
    </div>
  );
};
