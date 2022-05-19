/* eslint-disable indent */
import { sendMail } from 'utils/sendMail';

export const sendToArchivador = async ({
  idArchivador,
  no_cliente,
  nombre_cliente,
  apellidos_cliente,
  no_registro,
  desc_documento,
  no_aseguradora,
  desc_aseguradora,
  asunto_del_endoso,
  acs,
}) => {
  try {
    // Falta el enviar un correo al facturador
    const res = await fetch(`/api/queryGetDataArchivist?idArchivador=${idArchivador ?? 3}`);
    const { results } = await res.json();
    const { recordset } = results;
    console.log(recordset);
    const { email_archivador } = recordset[0];

    const fullname = 'renatogranadosgt@gmail.com';
    const subject = `Facturado ${no_registro}`;
    const message = `Se le ha facturado el registro "${no_registro}" del cliente "${no_cliente} - ${nombre_cliente} ${apellidos_cliente}".
    
    Tipo de documento "${desc_documento}"; número de póliza "${no_aseguradora}"; aseguradora "${desc_aseguradora}"; No. de solicitud o endoso "${
      acs ?? '---'
    }"
    
    Asunto del endoso: "${asunto_del_endoso ?? '---'}. Por favor, proceda a archivarla."`;

    sendMail({ email: email_archivador, fullname, subject, message });
  } catch (error) {
    console.log(error);
  }
};
