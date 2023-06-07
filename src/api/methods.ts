export const methods = {
  getAccountState: 'getStateInstance',
  checkWhatsApp: 'checkWhatsapp',
  getContactInfo: 'getContactInfo',
  sendMessage: 'sendMessage',
  receiveNotification: 'receiveNotification',
  deleteNotification: 'deleteNotification',
} as const;

export type ApiMethod = keyof typeof methods;
