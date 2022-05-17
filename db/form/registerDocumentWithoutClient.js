import { sendToRevisor } from 'db/emails/sendToRevisor';

export const registerDocumentWithoutClient = async ({ values }) => {
  const {
    asunto_endoso,
    comboBranches,
    comboDocument,
    comboEconomicGroups,
    comboInsurers,
    comboRevisor,
    created_by: creado_por,
    no_cliente,
    no_solicitud_acs,
    numero_de_poliza,
    numero_endoso_aseguradora,
    price: precio,
  } = values;
  const idBra = comboBranches.id;
  const idDoc = comboDocument.id;
  const idGro = comboEconomicGroups.id;
  const idIns = comboInsurers.id;
  const idRev = comboRevisor.id;

  try {
    const resultado = await fetch(
      `/api/insertDocumentWithoutClient?asunto_endoso=${asunto_endoso}&ramo_de_seguro=${idBra}&tipo_de_documento=${idDoc}&grupo_economico=${idGro}&aseguradora=${idIns}&creado_por=${creado_por}&no_cliente=${no_cliente}&no_solicitud_acs=${no_solicitud_acs}&numero_de_poliza=${numero_de_poliza}&numero_endoso_aseguradora=${numero_endoso_aseguradora}&id_revisor=${idRev}&precio=${precio}`
    );
    const { id_poliza } = await resultado.json();
    await sendToRevisor({ idPoliza: id_poliza });
  } catch (error) {
    console.log(error);
  }
};
