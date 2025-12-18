import api from './api';

export const sendMail = (data) =>
  api.post('/mail/send', data);

export const sendTemplateMail = (data) =>
  api.post('/mail/send-template', data);
