import { sendMail } from 'utils/sendMail';

export const sendToRevisor = async ({ idPoliza }) => {
  try {
    const res = await fetch(`/api/queryClientForEmail?idPoliza=${idPoliza}`);
    const { results } = await res.json();
    const { recordset } = results;
    const { numero_de_registro, no_de_poliza, aseguradora, tipo_de_documento, email_cliente, fullname, email_revisor } =
      recordset[0];
    const message = `Se le ha asignado el registro ${numero_de_registro} con el número de póliza ${no_de_poliza} de la seguradora ${aseguradora}, el tipo de documento es ${tipo_de_documento}`;
    const subject = 'Control de pólizas: Asviso de nuevo registro';
    console.log('el correo del cliente es ' + email_cliente);
    console.log('el correo del revisor es ' + email_revisor);
    // sendMail({ email: email_cliente, fullname, subject, message });
    // sendMail({ email: email_revisor, fullname, subject, message });
  } catch (error) {
    console.log(error);
  }
};
