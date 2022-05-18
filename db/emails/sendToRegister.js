import { sendMail } from 'utils/sendMail';

export const sendToRegister = async ({ registerEmail, message, subject, fullname }) => {
  try {
    sendMail({ email: registerEmail, fullname, subject, message });
  } catch (error) {
    console.log(error);
  }
};
