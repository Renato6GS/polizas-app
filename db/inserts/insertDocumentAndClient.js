const sql = require('mssql');
import { config } from 'db/config.js';
import { BRANCHES } from 'constants/branchesCombo.js';
import { INSURERS } from 'constants/insurersCombo';
import { DAYS, MONTHS, YEARS } from 'constants/datesCombo.js';
import { DOCUMENTS } from 'constants/documentCombo';
import { ECONOMIC_GROUPS } from 'constants/economicGroupsCombo';
import { GENDER } from 'constants/genderCombo';
import { REVISORES } from 'constants/revisoresCombo';

export async function insertDocumentAndClient({ query = {} }) {
  let resultado = '';

  const {
    apellidos_cliente,
    asunto_endoso,
    ramo_de_seguro,
    id_dia,
    tipo_de_documento,
    grupo_economico,
    id_gender,
    aseguradora,
    id_mes,
    id_anio,
    correo_cliente,
    creado_por,
    direccion_cliente,
    no_cliente,
    no_solicitud_acs,
    nombre_cliente,
    numero_de_poliza,
    numero_de_tel_cliente,
    numero_endoso_aseguradora,
    id_revisor,
    precio,
  } = query;

  console.log('esto es lo que viene:');
  console.log(query);

  const { name: name_dia } = DAYS.find((e) => e.id === id_dia);
  const { name: name_mes } = MONTHS.find((e) => e.id === id_mes);
  const { name: name_anio } = YEARS.find((e) => e.id === id_anio);
  const { idDB: id_ramo_de_seguro } = BRANCHES.find((e) => e.id === ramo_de_seguro);
  const { idDB: id_tipo_de_doc } = DOCUMENTS.find((e) => e.id === tipo_de_documento);
  const { idDB: id_grupo_economico } = ECONOMIC_GROUPS.find((e) => e.id === grupo_economico);
  const { idDB: id_idGender } = GENDER.find((e) => e.id === id_gender);
  const { idDB: id_aseguradora } = INSURERS.find((e) => e.id === aseguradora);
  const { idDB: id_rev } = REVISORES.find((e) => e.id === id_revisor);
  const ENDOSO = 5;

  const birhdayDate = `${name_anio}-${name_mes}-${name_dia}`;

  try {
    let pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('vCreadoPor', creado_por)
      .input('vNoCliente', Number(no_cliente))
      .input('vNombresCliente', nombre_cliente)
      .input('vApellidosCliente', apellidos_cliente)
      .input('vDireccionCliente', direccion_cliente)
      .input('vFechaDeNacCliente', birhdayDate)
      .input('vCorreoCliente', correo_cliente)
      .input('vSexoCliente', id_idGender)
      .input('vNumerosDeTelCliente', numero_de_tel_cliente)
      .input('vNumeroDeAseguradoraPoliza', numero_de_poliza)
      .input('vNumeroAseguradoraEndosoPoliza', id_tipo_de_doc === ENDOSO ? numero_endoso_aseguradora : null)
      .input('vNumeroSolicitudOACS', id_tipo_de_doc === ENDOSO ? no_solicitud_acs : null)
      .input('vIdDocumento', id_tipo_de_doc)
      .input('vAsuntoDelEndoso', id_tipo_de_doc === ENDOSO ? asunto_endoso : null)
      .input('vIdAseguradora', id_aseguradora)
      .input('vIdRamoDeSeguro', id_ramo_de_seguro)
      .input('vIdGrupoEconomico', id_grupo_economico)
      .input('vIdEstadoDelDocumento', 6)
      .input('vIdRevisor', id_rev)
      .input('vPrecioPoliza', precio)
      .input('vIdEstadoDelProceso', 11)
      .input(
        'vComentarioProceso',
        `Registro de nuevo documento y asignado al revisor ${id_rev} (generado automáticamente)`
      )
      .input('vUsuario', 'renato')
      .execute('SP_NUEVO_REGISTRO_DE_DATOS_DE_POLIZA');

    const { recordset } = result;
    const { id_poliza } = recordset[0];
    resultado = id_poliza;
  } catch (err) {
    console.log(err);
    resultado = false;
  } finally {
    sql.close();
  }

  return { resultado };
}
