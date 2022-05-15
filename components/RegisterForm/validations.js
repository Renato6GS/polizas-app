import { object, string, number } from 'yup';
import { messageErrors } from 'constants/messageErros';

export const schema = object()
  .shape({
    no_cliente: number()
      .typeError(messageErrors['mNumberTypeError'])
      .positive(messageErrors['mPositive'])
      .max(9999999, messageErrors['mStringMaxLength'])
      .integer(messageErrors['mInteger'])
      .required(messageErrors['mRequired']),
    nombre_cliente: string()
      .typeError(messageErrors['mStringTypeError'])
      .max(75, messageErrors['mStringMaxLength'])
      .required(messageErrors['mRequired']),
    apellidos_cliente: string()
      .typeError(messageErrors['mStringTypeError'])
      .max(75, messageErrors['mStringMaxLength'])
      .required(messageErrors['mRequired']),
    numero_de_tel_cliente: string()
      .typeError(messageErrors['mStringTypeError'])
      .min(7, messageErrors['mNumberPhone'])
      .max(75, messageErrors['mStringMaxLength'])
      .required(messageErrors['mRequired']),
    numero_de_poliza: number()
      .typeError(messageErrors['mNumberTypeError'])
      .positive(messageErrors['mPositive'])
      .max(9999999, messageErrors['mStringMaxLength'])
      .integer(messageErrors['mInteger'])
      .required(messageErrors['mRequired']),
    numero_endoso_aseguradora: number()
      .typeError(messageErrors['mNumberTypeError'])
      .positive(messageErrors['mPositive'])
      .max(9999999, messageErrors['mStringMaxLength'])
      .integer(messageErrors['mInteger'])
      .required(messageErrors['mRequired']),
    no_solicitud_acs: number()
      .typeError(messageErrors['mNumberTypeError'])
      .positive(messageErrors['mPositive'])
      .max(9999999, messageErrors['mStringMaxLength'])
      .integer(messageErrors['mInteger'])
      .required(messageErrors['mRequired']),
    asunto_endoso: string()
      .typeError(messageErrors['mStringTypeError'])
      .max(100, messageErrors['mStringMaxLength'])
      .required(messageErrors['mRequired']),
    price: number()
      .typeError(messageErrors['mNumberTypeError'])
      .positive(messageErrors['mPositive'])
      .max(9999999, messageErrors['mStringMaxLength'])
      .required(messageErrors['mRequired']),
  })
  .required();
