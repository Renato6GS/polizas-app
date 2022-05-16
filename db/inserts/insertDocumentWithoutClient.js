const sql = require('mssql');
import { config } from 'db/config.js';
import { BRANCHES } from 'constants/branchesCombo.js';
import { INSURERS } from 'constants/insurersCombo';
import { DOCUMENTS } from 'constants/documentCombo';
import { ECONOMIC_GROUPS } from 'constants/economicGroupsCombo';

export async function insertDocumentWithoutClient({ query = {} }) {
  let success = false;

  const {
    asunto_endoso,
    ramo_de_seguro,
    tipo_de_documento,
    grupo_economico,
    aseguradora,
    creado_por,
    no_cliente,
    no_solicitud_acs,
    numero_de_poliza,
    numero_endoso_aseguradora,
    precio,
  } = query;

  const { idDB: id_ramo_de_seguro } = BRANCHES.find((e) => e.id === ramo_de_seguro);
  const { idDB: id_tipo_de_doc } = DOCUMENTS.find((e) => e.id === tipo_de_documento);
  const { idDB: id_grupo_economico } = ECONOMIC_GROUPS.find((e) => e.id === grupo_economico);
  const { idDB: id_aseguradora } = INSURERS.find((e) => e.id === aseguradora);

  try {
    let pool = await sql.connect(config);
    await pool
      .request()
      .input('vCreadoPor', creado_por)
      .input('vNoCliente', Number(no_cliente))
      .input('vNumeroDeAseguradoraPoliza', numero_de_poliza)
      .input('vNumeroAseguradoraEndosoPoliza', numero_endoso_aseguradora)
      .input('vNumeroSolicitudOACS', no_solicitud_acs)
      .input('vIdDocumento', id_tipo_de_doc)
      .input('vAsuntoDelEndoso', asunto_endoso)
      .input('vIdAseguradora', id_aseguradora)
      .input('vIdRamoDeSeguro', id_ramo_de_seguro)
      .input('vIdGrupoEconomico', id_grupo_economico)
      .input('vIdEstadoDelDocumento', 6)
      .input('vPrecioPoliza', precio)
      .input('vIdEstadoDelProceso', 10)
      .input('vComentarioProceso', 'Registro de nuevo documento (generado automáticamente)')
      .input('vUsuario', 'renato')
      .execute('SP_NUEVO_REGISTRO_DE_DATOS_DE_POLIZA_CON_CLIENTE_EXISTENTE');

    success = true;
  } catch (err) {
    console.log(err);
  } finally {
    sql.close();
  }

  return success;
}
