import { sendToRevisor } from 'db/emails/sendToRevisor';

export const registerDocumentAndClient = async ({ values }) => {
  const {
    apellidos_cliente,
    asunto_endoso,
    comboBranches,
    comboDay,
    comboDocument,
    comboEconomicGroups,
    comboGender,
    comboInsurers,
    comboMonth,
    comboYear,
    comboRevisor,
    correo_cliente,
    created_by: creado_por,
    direccion_cliente,
    no_cliente,
    no_solicitud_acs,
    nombre_cliente,
    numero_de_poliza,
    numero_de_tel_cliente,
    numero_endoso_aseguradora,
    price: precio,
  } = values;
  const idBra = comboBranches.id;
  const idDay = comboDay.id;
  const idDoc = comboDocument.id;
  const idGro = comboEconomicGroups.id;
  const idGen = comboGender.id;
  const idIns = comboInsurers.id;
  const idMon = comboMonth.id;
  const idYea = comboYear.id;
  const idRev = comboRevisor.id;

  try {
    const resultado = await fetch(
      `/api/insertDocumentAndClient?apellidos_cliente=${apellidos_cliente}&asunto_endoso=${asunto_endoso}&ramo_de_seguro=${idBra}&id_dia=${idDay}&tipo_de_documento=${idDoc}&grupo_economico=${idGro}&id_gender=${idGen}&aseguradora=${idIns}&id_mes=${idMon}&id_anio=${idYea}&correo_cliente=${correo_cliente}&creado_por=${creado_por}&direccion_cliente=${direccion_cliente}&no_cliente=${no_cliente}&no_solicitud_acs=${no_solicitud_acs}&nombre_cliente=${nombre_cliente}&numero_de_poliza=${numero_de_poliza}&numero_de_tel_cliente=${numero_de_tel_cliente}&numero_endoso_aseguradora=${numero_endoso_aseguradora}&id_revisor=${idRev}&precio=${precio}`
    );
    const { id_poliza } = await resultado.json();
    await sendToRevisor({ idPoliza: id_poliza });
  } catch (error) {
    console.log(error);
  }
};
