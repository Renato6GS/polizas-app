/* eslint-disable indent */
import { object, string, number, lazy } from 'yup';
import { messageErrors } from 'constants/messageErros';

export const schema = object()
  .shape({
    no_cliente: number()
      .typeError(messageErrors['mNumberTypeError'])
      .positive(messageErrors['mPositive'])
      .max(9999999, messageErrors['mStringMaxLength'])
      .integer(messageErrors['mInteger'])
      .required(messageErrors['mRequired']),
    nombre_cliente: string().typeError(messageErrors['mStringTypeError']).max(75, messageErrors['mStringMaxLength']),
    apellidos_cliente: string().typeError(messageErrors['mStringTypeError']).max(75, messageErrors['mStringMaxLength']),
    correo_cliente: string().email(messageErrors['mEmail']).max(75, messageErrors['mStringMaxLength']),
    direccion_cliente: string().typeError(messageErrors['mStringTypeError']).max(75, messageErrors['mStringMaxLength']),
    numero_de_tel_cliente: string()
      .typeError(messageErrors['mStringTypeError'])
      .max(75, messageErrors['mStringMaxLength']),
    numero_de_poliza: number()
      .typeError(messageErrors['mNumberTypeError'])
      .positive(messageErrors['mPositive'])
      .max(9999999, messageErrors['mStringMaxLength'])
      .integer(messageErrors['mInteger'])
      .required(messageErrors['mRequired']),
    numero_endoso_aseguradora: lazy((value) =>
      value === ''
        ? string()
        : number()
            .typeError(messageErrors['mNumberTypeError'])
            .positive(messageErrors['mPositive'])
            .max(9999999, messageErrors['mStringMaxLength'])
            .integer(messageErrors['mInteger'])
            .required(messageErrors['mRequired'])
    ),
    no_solicitud_acs: lazy((value) =>
      value === ''
        ? string()
        : number()
            .typeError(messageErrors['mNumberTypeError'])
            .positive(messageErrors['mPositive'])
            .max(9999999, messageErrors['mStringMaxLength'])
            .integer(messageErrors['mInteger'])
            .required(messageErrors['mRequired'])
    ),
    asunto_endoso: string().typeError(messageErrors['mStringTypeError']).max(100, messageErrors['mStringMaxLength']),
    price: number()
      .typeError(messageErrors['mNumberTypeError'])
      .positive(messageErrors['mPositive'])
      .max(9999999, messageErrors['mStringMaxLength'])
      .required(messageErrors['mRequired']),
    created_by: string()
      .typeError(messageErrors['mStringTypeError'])
      .email(messageErrors['mEmail'])
      .max(100, messageErrors['mStringMaxLength'])
      .required(messageErrors['mRequired']),
  })
  .required();
