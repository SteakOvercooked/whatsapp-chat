import { Button, TextField } from '@mui/material';
import loginStyles from '@styles/login.module.scss';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema, LoginFormFields } from './schema';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import useFetch from '@hooks/useFetch';
import { GreenApi } from '@api/green_api';
import { RootState } from '@store/store';
import { useSelector, useDispatch } from 'react-redux';
import { init } from '@store/api_instance_slice';
import { useNavigate } from 'react-router';

export const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormFields>({
    mode: 'onChange',
    resolver: zodResolver(schema),
  });
  const apiInstance = useSelector((state: RootState) => state.apiInstance);
  const dispatch = useDispatch();
  const [fetchAccInfo, { data, loading, error }] = useFetch(
    () => GreenApi.isAccountAvailable(),
    []
  );
  const navigate = useNavigate();

  if (data && data.isAvailable) navigate('/chat');

  console.log(data, loading, error);

  const onSubmit = (data: LoginFormFields) => {
    dispatch(init(data));
    GreenApi.setInstance(data.id, data.apiToken);
    fetchAccInfo((result) => (result.isAvailable ? { error: null } : { error: result.reason }));
  };

  return (
    <div className={loginStyles.container}>
      <form className={loginStyles.form} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name='id'
          control={control}
          render={({ field }) => (
            <TextField
              required
              defaultValue={apiInstance.id}
              fullWidth
              label='idInstance'
              error={errors.id !== undefined}
              helperText={errors.id !== undefined ? errors.id.message : ' '}
              placeholder='Введите Ваш idInstance'
              className={loginStyles.textInput}
              {...field}></TextField>
          )}
        />
        <Controller
          name='apiToken'
          control={control}
          render={({ field }) => (
            <TextField
              required
              defaultValue={apiInstance.apiToken}
              fullWidth
              label='apiTokenInstance'
              error={errors.apiToken !== undefined}
              helperText={errors.apiToken !== undefined ? errors.apiToken.message : ' '}
              placeholder='Введите Ваш apiTokenInstance'
              className={loginStyles.textInput}
              {...field}></TextField>
          )}
        />
        <Button
          variant='contained'
          disabled={!isValid}
          size='large'
          type='submit'
          className={loginStyles.loginButton}
          endIcon={<WhatsAppIcon />}>
          Войти
        </Button>
      </form>
    </div>
  );
};
