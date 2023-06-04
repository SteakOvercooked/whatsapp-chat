import { methods, ApiMethod } from './methods';
import type { ContactInfo, GreenApiResponse } from './green_api_response';
import axios from 'axios';

type PhoneNumber = number;
type ChatID = `${PhoneNumber}@c.us`;

type CommonResponse = {
  success: boolean;
  error: string | null;
};

type PayloadResponse<T> = CommonResponse & {
  data: T | null;
};

const API_ROOT = 'https://api.green-api.com';

function processError(err: unknown): CommonResponse {
  if (axios.isAxiosError(err) && err.response) {
    const { status, statusText } = err.response;
    return { success: false, error: `${status}: ${statusText}` };
  }
  if (err instanceof Error) return { success: false, error: err.message };
  return { success: false, error: 'Неизвестная ошибка!' };
}

export class GreenApi {
  private static id: string | null;
  private static apiToken: string | null;
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

  static async checkWhatsApp(phoneNumber: PhoneNumber): Promise<CommonResponse> {
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

  static async getContactInfo(chatId: ChatID): Promise<PayloadResponse<ContactInfo>> {
    try {
      const result = await axios.post<GreenApiResponse<'getContactInfo'>>(
        GreenApi.endpoint('getContactInfo'),
        { chatId }
      );
      return { success: true, data: result.data, error: null };
    } catch (error) {
      const commonResponse = processError(error);
      return { ...commonResponse, data: null };
    }
  }
}
