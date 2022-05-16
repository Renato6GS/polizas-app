export const registerDocumentWithoutClient = async ({ values }) => {
  const {
    asunto_endoso,
    comboBranches,
    comboDocument,
    comboEconomicGroups,
    comboInsurers,
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

  try {
    const success = await fetch(
      `/api/insertDocumentWithoutClient?asunto_endoso=${asunto_endoso}&ramo_de_seguro=${idBra}&tipo_de_documento=${idDoc}&grupo_economico=${idGro}&aseguradora=${idIns}&creado_por=${creado_por}&no_cliente=${no_cliente}&no_solicitud_acs=${no_solicitud_acs}&numero_de_poliza=${numero_de_poliza}&numero_endoso_asegurador=${numero_endoso_aseguradora}&precio=${precio}`
    );
    const { estado } = await success.json();
    if (estado) {
      alert('los datos se insertaron correctamente sii');
    } else {
      alert('hubo un fallo');
    }
  } catch (error) {
    console.log('fallo el fetch');
    console.log(error);
  }
};
