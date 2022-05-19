/* eslint-disable indent */
import { sendMail } from 'utils/sendMail';

export const sendToEjecutivo = async ({
  idPoliza,
  idEjecutivo,
  no_cliente,
  nombre_cliente,
  apellidos_cliente,
  comentario,
  no_registro,
}) => {
  try {
    // Falta el enviar un correo al facturador
    console.log('Estamos a punto de hacer la consulta');
    const res = await fetch(`/api/queryGetDataExecute?idEjecutivo=${idEjecutivo}`);
    const { results } = await res.json();
    const { recordset } = results;
    console.log(recordset);
    const { email_ejecutivo_de_cuenta } = recordset[0];

    const fullname = 'renatogranadosgt@gmail.com';
    const subject = `Fallo a facturar póliza ${idPoliza}`;
    const message = `No se ha podido a facturar el registro "${no_registro}" del cliente "${no_cliente} - ${nombre_cliente} ${apellidos_cliente}".
    Los errores encontrados son: ${comentario}"`;

    console.log('Estamos apunto de mandar el correo a la api');

    sendMail({ email: email_ejecutivo_de_cuenta, fullname, subject, message });
  } catch (error) {
    console.log(error);
  }
};
