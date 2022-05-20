import { BRANCHES } from 'constants/branchesCombo.js';
import { INSURERS } from 'constants/insurersCombo';
import { DAYS, MONTHS, YEARS } from 'constants/datesCombo.js';
import { DOCUMENTS } from 'constants/documentCombo';
import { ECONOMIC_GROUPS } from 'constants/economicGroupsCombo';
import { GENDER } from 'constants/genderCombo';
import { REVISORES } from 'constants/revisoresCombo';
import { EJECUTIVOS } from 'constants/ejecutivoDeCuentaCombo';
import { ESTADOS_DEL_DOCUMENTO } from 'constants/estadosDelDocumentoCombo';
import { ESTADOS_DEl_PROCESO } from 'constants/proccessStatesCombo';
import { FACTURADORES } from 'constants/facturadoresCombo';

export const obtenerDatosParaActualizacionDePoliza = async ({ values, vIdPoliza }) => {
  const {
    apellidos_cliente: vApellidosCliente,
    asunto_endoso: vAsunto_del_endoso,
    comboBranches,
    comboDay,
    comboDocument,
    comboEconomicGroups,
    comboEjecutivos,
    comboEstadoDocumento,
    comboEstadoProceso,
    comboFacturador,
    comboGender,
    comboInsurers,
    comboMonth,
    comboYear,
    comboRevisor,
    comentario: vComentario,
    correo_cliente: vEmailCliente,
    created_by: vCreador_por_poliza,
    direccion_cliente: vDireccionCliente,
    editadoPor: vEditadoPor,
    no_cliente: vNoCliente,
    no_solicitud_acs: vNumero_solicitud_numero_endoso_en_acs_poliza,
    nombre_cliente: vNombreCliente,
    numero_de_poliza: vNumero_aseguradora_poliza,
    numero_de_tel_cliente: vNumerosDeTelefono,
    numero_endoso_aseguradora: vNumero_aseguradora_endoso_poliza,
    price: vPrecio_poliza,
    reqDeCobro: vReq_de_cobro_poliza,
    revSNC: vRevision_snc_poliza,
  } = values;
  const vUsuario = 'renato';
  const idBra = comboBranches.id;
  const idDay = comboDay.id;
  const idDoc = comboDocument.id;
  const idGro = comboEconomicGroups.id;
  const idGen = comboGender.id;
  const idIns = comboInsurers.id;
  const idMon = comboMonth.id;
  const idYea = comboYear.id;
  const idRev = comboRevisor.id;
  const idEje = comboEjecutivos.id;
  const idEstDoc = comboEstadoDocumento.id;
  const idEstPro = comboEstadoProceso.id;
  const idFac = comboFacturador.id;

  const { name: name_dia } = DAYS.find((e) => e.id === idDay);
  const { name: name_mes } = MONTHS.find((e) => e.id === idMon);
  const { name: name_anio } = YEARS.find((e) => e.id === idYea);
  const { idDB: vId_ramo_de_seguro } = BRANCHES.find((e) => e.id === idBra);
  const { idDB: vId_tipo_de_documento } = DOCUMENTS.find((e) => e.id === idDoc);
  const { idDB: vId_grupo_economico } = ECONOMIC_GROUPS.find((e) => e.id === idGro);
  const { idDB: vIdGenero } = GENDER.find((e) => e.id === idGen);
  const { idDB: vId_aseguradora } = INSURERS.find((e) => e.id === idIns);
  const { idDB: vId_revisor } = REVISORES.find((e) => e.id === idRev);
  const { idDB: vId_ejecutivo_de_cuenta } = EJECUTIVOS.find((e) => e.id === idEje);
  const { idDB: vId_estado_del_documento } = ESTADOS_DEL_DOCUMENTO.find((e) => e.id === idEstDoc);
  const { idDB: vIdEstadoDelProceso } = ESTADOS_DEl_PROCESO.find((e) => e.id === idEstPro);
  const { idDB: vId_facturador } = FACTURADORES.find((e) => e.id === idFac);
  // const ENDOSO = 5;

  const birhdayDate = `${name_anio}-${name_mes}-${name_dia}`;

  try {
    await fetch('/api/updatePolicyData', {
      body: JSON.stringify({
        vNoCliente,
        vNombreCliente,
        vApellidosCliente,
        vFechaDeNac: birhdayDate,
        vEmailCliente,
        vDireccionCliente,
        vIdGenero,
        vNumerosDeTelefono,
        vIdPoliza,
        vNumero_aseguradora_poliza,
        vId_tipo_de_documento,
        vNumero_aseguradora_endoso_poliza,
        vNumero_solicitud_numero_endoso_en_acs_poliza,
        vAsunto_del_endoso,
        vId_aseguradora,
        vId_ramo_de_seguro,
        vId_grupo_economico,
        vId_revisor,
        vPrecio_poliza,
        vCreador_por_poliza,
        vId_ejecutivo_de_cuenta,
        vId_facturador,
        vId_estado_del_documento,
        vRevision_snc_poliza,
        vReq_de_cobro_poliza,
        vIdEstadoDelProceso,
        vComentario,
        vEditadoPor,
        vUsuario,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    alert('Datos actualizado correctamente.');
  } catch (error) {
    alert('Fallo la actualización.');
    console.log(error);
  }
};
