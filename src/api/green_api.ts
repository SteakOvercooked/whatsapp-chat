import { methods, ApiMethod } from './methods';
import type { GreenApiResponse } from './api_types';
import axios from 'axios';
import { getChatID } from '../utils';

type ResponseSuccessfull = {
  success: true;
  error: null;
};
type ResponseFailed = {
  success: false;
  error: string;
};
type CommonResponse = ResponseFailed | ResponseSuccessfull;

type WithData<TData, TMerged> = TMerged & { data: TData };
type PayloadResponse<TPayload> =
  | WithData<null, ResponseFailed>
  | WithData<TPayload, ResponseSuccessfull>;

const API_ROOT = 'https://api.green-api.com';

function processError(err: unknown): ResponseFailed {
  if (axios.isAxiosError(err) && err.response) {
    const { status, statusText } = err.response;
    return { success: false, error: `${status}: ${statusText}` };
  }
  if (err instanceof Error) return { success: false, error: err.message };
  return { success: false, error: 'Неизвестная ошибка!' };
}

export class GreenApi {
  private static id: string | null = null;
  private static apiToken: string | null = null;
  static setInstance(id: string | null, apiToken: string | null) {
    GreenApi.id = id;
    GreenApi.apiToken = apiToken;
  }

  constructor() {
    throw new Error('Class is static');
  }

  private static endpoint(method: ApiMethod) {
    const id = GreenApi.id;
    const apiToken = GreenApi.apiToken;
    if (!apiToken || !id) throw new Error('Нет данных для создания запросов!');
    return new URL(`waInstance${id}/${methods[method]}/${apiToken}`, API_ROOT).href;
  }

  static isInstantiated(): boolean {
    return GreenApi.apiToken !== null && GreenApi.id !== null;
  }

  static async isAccountAvailable(): Promise<CommonResponse> {
    try {
      const result = await axios.get<GreenApiResponse<'getAccountState'>>(
        GreenApi.endpoint('getAccountState')
      );
      const state = result.data.stateInstance;
      if (state !== 'authorized')
        return {
          success: false,
          error: `Требуемое состояние аккаунта: authorized, текущее состояние: ${state}`,
        };
      return { success: true, error: null };
    } catch (error) {
      return processError(error);
    }
  }

  static async checkWhatsApp(phoneNumber: number): Promise<CommonResponse> {
    try {
      const result = await axios.post<GreenApiResponse<'checkWhatsApp'>>(
        GreenApi.endpoint('checkWhatsApp'),
        { phoneNumber }
      );
      const doesExist = result.data.existsWhatsapp;
      if (!doesExist)
        return {
          success: false,
          error: `На данном телефоне отсутствует WhatsApp!`,
        };
      return { success: true, error: null };
    } catch (error) {
      return processError(error);
    }
  }

  static async getContactInfo(
    id: number
  ): Promise<PayloadResponse<GreenApiResponse<'getContactInfo'>>> {
    try {
      const { data } = await axios.post<GreenApiResponse<'getContactInfo'>>(
        GreenApi.endpoint('getContactInfo'),
        { chatId: getChatID(id) }
      );
      return { success: true, data, error: null };
    } catch (error) {
      const commonResponse = processError(error);
      return { ...commonResponse, data: null };
    }
  }

  static async sendMessage(id: number, message: string): Promise<CommonResponse> {
    try {
      await axios.post<GreenApiResponse<'sendMessage'>>(GreenApi.endpoint('sendMessage'), {
        chatId: getChatID(id),
        message,
      });
      return { success: true, error: null };
    } catch (error) {
      return processError(error);
    }
  }

  static async receiveNotification(): Promise<
    PayloadResponse<GreenApiResponse<'receiveNotification'>>
  > {
    try {
      const { data } = await axios.get<GreenApiResponse<'receiveNotification'>>(
        GreenApi.endpoint('receiveNotification')
      );
      return { success: true, data, error: null };
    } catch (error) {
      const commonResponse = processError(error);
      return { ...commonResponse, data: null };
    }
  }

  static async deleteNotification(receiptId: number): Promise<CommonResponse> {
    try {
      const standardEndpoint = GreenApi.endpoint('deleteNotification');
      const { data } = await axios.delete<GreenApiResponse<'deleteNotification'>>(
        standardEndpoint + `/${receiptId}`
      );
      if (!data.result)
        throw new Error(`Не удалось удалить уведомление о сообщение, receiptId: ${receiptId}`);
      return { success: true, error: null };
    } catch (error) {
      return processError(error);
    }
  }
}
