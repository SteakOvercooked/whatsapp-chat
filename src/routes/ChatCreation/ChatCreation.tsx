import { Button, TextField } from '@mui/material';
import { PatternFormat } from 'react-number-format';
import createChatStyles from './chat_creation.module.scss';
import uiElementsStyles from '@styles/ui_elements.module.scss';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema, CreateChatFields } from './schema';
import useFetch from '@hooks/useFetch';
import { GreenApi } from '@api/green_api';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import { RootState } from '@store/store';
import { useSelector, useDispatch } from 'react-redux';
import { init } from '@store/phone_slice';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { purifyPhone } from '../../utils';

export const CreateChat = () => {
  const phoneNumber = useSelector((state: RootState) => state.phone.number);
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<CreateChatFields>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: {
      phone: phoneNumber === null ? undefined : phoneNumber,
    },
  });
  const dispatch = useDispatch();
  const [fetchPhoneExists, phoneData] = useFetch(GreenApi.checkWhatsApp, {
    deps: [],
    validate: (result) => (result.success ? { error: null } : { error: result.error }),
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!GreenApi.isInstantiated()) navigate('../../', { replace: true });
  }, []);

  useEffect(() => {
    const { data, error } = phoneData;
    if (data && data.success) navigate(`/chat/${purifyPhone(getValues('phone'))}`);
    if (error) alert(error);
  }, [phoneData]);

  const onSubmit = (data: CreateChatFields) => {
    dispatch(init({ number: data.phone }));
    fetchPhoneExists(parseInt(purifyPhone(data.phone)));
  };

  return (
    <div className={createChatStyles.formContainer}>
      <form className={createChatStyles.form} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name='phone'
          control={control}
          render={({ field }) => (
            <PatternFormat
              format='+7 (###) ###-##-##'
              customInput={TextField}
              required
              type='tel'
              defaultValue={phoneNumber}
              fullWidth
              label='Phone number'
              error={errors.phone !== undefined}
              helperText={errors.phone !== undefined ? errors.phone.message : ' '}
              placeholder='Введите телефонный номер контакта в международном формате'
              className={uiElementsStyles.textField}
              {...field}></PatternFormat>
          )}
        />
        <Button
          variant='contained'
          disabled={!isValid}
          size='large'
          type='submit'
          className={uiElementsStyles.buttonPrimary}
          endIcon={<QuestionAnswerRoundedIcon />}>
          Открыть чат
        </Button>
      </form>
    </div>
  );
};
