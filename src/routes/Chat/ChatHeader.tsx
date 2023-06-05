import type { ContactInfo } from '@api/api_types';
import headerStyles from './chat_header.module.scss';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

export const ChatHeader = ({ name, avatar }: ContactInfo) => {
  return (
    <div className={headerStyles.wrapper}>
      {avatar !== '' && <img alt='Аватар контакта' src={avatar} className={headerStyles.avatar} />}
      {avatar === '' && <AccountCircleRoundedIcon className={headerStyles.avatarDefault} />}
      <span className={headerStyles.name}>{name !== '' ? name : 'Без имени'}</span>
    </div>
  );
};
