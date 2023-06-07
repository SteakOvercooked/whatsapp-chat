import { Button, TextField } from '@mui/material';
import loginStyles from './login.module.scss';
import uiElementsStyles from '@styles/ui_elements.module.scss';
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
import { useEffect } from 'react';

export const Login = () => {
  const apiInstance = useSelector((state: RootState) => state.apiInstance);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormFields>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: {
      apiToken: apiInstance.apiToken === null ? undefined : apiInstance.apiToken,
      id: apiInstance.id === null ? undefined : apiInstance.id,
    },
  });
  const dispatch = useDispatch();
  const [fetchAccInfo, accountInfo] = useFetch(GreenApi.isAccountAvailable, {
    deps: [],
    validate: (result) => (result.success ? { error: null } : { error: result.error }),
  });
  const navigate = useNavigate();

  useEffect(() => {
    const { data, error } = accountInfo;
    if (data && data.success) navigate('/chat/create');
    if (error) alert(error);
  }, [accountInfo]);

  const onSubmit = (data: LoginFormFields) => {
    dispatch(init(data));
    GreenApi.setInstance(data.id, data.apiToken);
    fetchAccInfo();
  };

  return (
    <div className={loginStyles.formContainer}>
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
              className={uiElementsStyles.textField}
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
              className={uiElementsStyles.textField}
              {...field}></TextField>
          )}
        />
        <Button
          variant='contained'
          disabled={!isValid}
          size='large'
          type='submit'
          className={uiElementsStyles.buttonPrimary}
          endIcon={<WhatsAppIcon />}>
          Войти
        </Button>
      </form>
    </div>
  );
};
