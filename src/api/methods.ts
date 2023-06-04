export const methods = {
  getAccountState: 'getStateInstance',
  checkWhatsApp: 'checkWhatsapp',
  getContactInfo: 'getContactInfo',
  sendMessage: 'sendMessage',
} as const;

export type ApiMethod = keyof typeof methods;
