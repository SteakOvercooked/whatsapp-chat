import { Button, Input } from '@mui/material';
import classnames from 'classnames';
import uiElementsStyles from '@styles/ui_elements.module.scss';
import controlStyles from './chat_controls.module.scss';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { useState } from 'react';

type ChatControlsProps = {
  onSend: (text: string) => void;
};

export const ChatControls = ({ onSend }: ChatControlsProps) => {
  const [message, setMessage] = useState('');

  const onClick = () => {
    onSend(message);
    setMessage('');
  };

  return (
    <div className={controlStyles.wrapper}>
      <Input
        disableUnderline={true}
        fullWidth
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        placeholder='Напишите сообщение...'
        className={uiElementsStyles.input}></Input>
      <Button
        onClick={onClick}
        variant='contained'
        title='Отправить сообщение'
        className={classnames(uiElementsStyles.buttonPrimary, uiElementsStyles.buttonSend)}
        endIcon={<SendRoundedIcon />}></Button>
    </div>
  );
};
