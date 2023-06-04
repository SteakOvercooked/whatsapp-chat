import { methods, ApiMethod } from './methods';
import type { GreenApiResponse } from './green_api_response';
import axios from 'axios';

type AccountAvailability = {
  isAvailable: boolean;
  reason: string | null;
};

const API_ROOT = 'https://api.green-api.com';

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

  static async isAccountAvailable(): Promise<AccountAvailability> {
    try {
      const result = await axios.get<GreenApiResponse<'getAccountState'>>(
        GreenApi.endpoint('getAccountState')
      );
      const state = result.data.stateInstance;
      if (state !== 'authorized')
        return {
          isAvailable: false,
          reason: `Требуемое состояние аккаунта: authorized, текущее состояние: ${state}`,
        };
      return { isAvailable: true, reason: null };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, statusText } = error.response;
        return { isAvailable: false, reason: `${status}: ${statusText}` };
      }
      if (error instanceof Error) return { isAvailable: false, reason: error.message };
      return { isAvailable: false, reason: 'Неизвестная ошибка!' };
    }
  }
}
