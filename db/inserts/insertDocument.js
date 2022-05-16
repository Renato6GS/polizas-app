const sql = require('mssql');
import { config } from 'db/config.js';
import { BRANCHES } from 'constants/branchesCombo.js';
import { INSURERS } from 'constants/insurersCombo';
import { DAYS, MONTHS, YEARS } from 'constants/datesCombo.js';
import { DOCUMENTS } from 'constants/documentCombo';
import { ECONOMIC_GROUPS } from 'constants/economicGroupsCombo';
import { GENDER } from 'constants/genderCombo';

export async function insertDocument({ query = {} }) {
  let success = false;

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
    precio,
  } = query;

  const { name: name_dia } = DAYS.find((e) => e.id === id_dia);
  const { name: name_mes } = MONTHS.find((e) => e.id === id_mes);
  const { name: name_anio } = YEARS.find((e) => e.id === id_anio);
  const { idDB: id_ramo_de_seguro } = BRANCHES.find((e) => e.id === ramo_de_seguro);
  const { idDB: id_tipo_de_doc } = DOCUMENTS.find((e) => e.id === tipo_de_documento);
  const { idDB: id_grupo_economico } = ECONOMIC_GROUPS.find((e) => e.id === grupo_economico);
  const { idDB: id_idGender } = GENDER.find((e) => e.id === id_gender);
  const { idDB: id_aseguradora } = INSURERS.find((e) => e.id === aseguradora);

  const birhdayDate = `${name_anio}-${name_mes}-${name_dia}`;

  try {
    let pool = await sql.connect(config);
    await pool
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
      .execute('SP_NUEVO_REGISTRO_DE_DATOS_DE_POLIZA');

    success = true;
  } catch (err) {
    console.log(err);
  } finally {
    sql.close();
  }

  return success;
}
