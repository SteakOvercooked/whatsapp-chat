import { Button, TextField } from '@mui/material';
import loginStyles from '@styles/login.module.scss';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema, LoginFormFields } from './schema';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormFields>({
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: LoginFormFields) => {
    console.log(data);
  };

  return (
    <div className={loginStyles.container}>
      <form className={loginStyles.form} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name='idInstance'
          control={control}
          render={({ field }) => (
            <TextField
              required
              fullWidth
              label='idInstance'
              error={errors.idInstance !== undefined}
              helperText={errors.idInstance !== undefined ? errors.idInstance.message : ' '}
              placeholder='Введите Ваш idInstance'
              className={loginStyles.textInput}
              {...field}></TextField>
          )}
        />
        <Controller
          name='apiTokenInstance'
          control={control}
          render={({ field }) => (
            <TextField
              required
              fullWidth
              label='apiTokenInstance'
              error={errors.apiTokenInstance !== undefined}
              helperText={
                errors.apiTokenInstance !== undefined ? errors.apiTokenInstance.message : ' '
              }
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
