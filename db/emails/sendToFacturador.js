/* eslint-disable indent */
import { sendMail } from 'utils/sendMail';

export const sendToFacturador = async ({ idPoliza }) => {
  try {
    // Falta el enviar un correo al facturador
    console.log('Estamos a punto de hacer la consulta');
    const res = await fetch(`/api/queryGetDataForBillerEmail?idPoliza=${idPoliza}`);
    const { results } = await res.json();
    const { recordset } = results;
    console.log(recordset);
    const {
      no_registro,
      no_cliente,
      nombre_cliente,
      apellidos_cliente,
      desc_documento,
      no_aseguradora,
      desc_aseguradora,
      acs,
      asunto_del_endoso,
      email_facturador,
    } = recordset[0];

    const fullname = 'renatogranadosgt@gmail.com';
    const subject = `Asignado a facturar póliza ${no_registro}`;
    const message = `Se le ha asignado para facturar el registro "${no_registro}" del cliente "${no_cliente} - ${nombre_cliente} ${apellidos_cliente}".
    
    Tipo de documento "${desc_documento}"; número de póliza "${no_aseguradora}"; aseguradora "${desc_aseguradora}"; No. de solicitud o endoso "${
      acs ?? '---'
    }"
    
    Asunto del endoso: "${asunto_del_endoso ?? '---'}"`;

    sendMail({ email: email_facturador, fullname, subject, message });
  } catch (error) {
    console.log(error);
  }
};
