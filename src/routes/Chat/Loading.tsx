import loadingStyles from './loading.module.scss';
import CircularProgress from '@mui/material/CircularProgress';

export const Loading = () => {
  return <CircularProgress className={loadingStyles.loading} />;
};
