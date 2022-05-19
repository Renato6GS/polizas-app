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
    const res = await fetch(`/api/queryGetDataExecute?idEjecutivo=${idEjecutivo}`);
    const { results } = await res.json();
    const { recordset } = results;
    const { email_ejecutivo_de_cuenta } = recordset[0];

    const fullname = 'renatogranadosgt@gmail.com';
    const subject = `Fallo a facturar póliza ${idPoliza}`;
    const message = `No se ha podido a facturar el registro "${no_registro}" del cliente "${no_cliente} - ${nombre_cliente} ${apellidos_cliente}".
    Los errores encontrados son: ${comentario}"`;

    sendMail({ email: email_ejecutivo_de_cuenta, fullname, subject, message });
  } catch (error) {
    console.log(error);
  }
};

export const sendToEjecutivoWithoutData = async ({ idPoliza }) => {
  const res = await fetch(`/api/queryPolicy?idPoliza=${idPoliza}`);
  const { results } = await res.json();
  const { recordset } = results;
  const {
    id_ejecutivo_de_cuenta: idEjecutivo,
    no_cliente,
    nombre_cliente,
    apellidos_cliente,
    numero_aseguradora_poliza: no_registro,
  } = recordset[0];
  try {
    const res = await fetch(`/api/queryGetDataExecute?idEjecutivo=${idEjecutivo}`);
    const { results } = await res.json();
    const { recordset } = results;
    const { email_ejecutivo_de_cuenta } = recordset[0];

    const fullname = 'renatogranadosgt@gmail.com';
    const subject = `Póliza archivada ${idPoliza}`;
    const message = `La póliza "${no_registro}" del cliente "${no_cliente} - ${nombre_cliente} ${apellidos_cliente}".
    Ha sido archivado correctamente.`;

    sendMail({ email: email_ejecutivo_de_cuenta, fullname, subject, message });
  } catch (error) {
    console.log(error);
  }
};
