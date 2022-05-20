const sql = require('mssql');
import { config } from 'db/config.js';

export async function actualizarDatosPoliza({ data }) {
  const {
    vNoCliente,
    vNombreCliente,
    vApellidosCliente,
    vFechaDeNac,
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
  } = data;
  let result1 = '';

  const ENDOSO = 5;

  try {
    let pool = await sql.connect(config);
    result1 = await pool
      .request()
      .input('vNoCliente', vNoCliente)
      .input('vNombreCliente', vNombreCliente)
      .input('vApellidosCliente', vApellidosCliente)
      .input('vFechaDeNac', vFechaDeNac)
      .input('vEmailCliente', vEmailCliente)
      .input('vDireccionCliente', vDireccionCliente)
      .input('vIdGenero', Number(vIdGenero))
      .input('vNumerosDeTelefono', vNumerosDeTelefono)
      .input('vIdPoliza', Number(vIdPoliza))
      .input('vNumero_aseguradora_poliza', vNumero_aseguradora_poliza)
      .input('vId_tipo_de_documento', Number(vId_tipo_de_documento))
      .input(
        'vNumero_aseguradora_endoso_poliza',
        vId_tipo_de_documento === ENDOSO ? vNumero_aseguradora_endoso_poliza : null
      )
      .input(
        'vNumero_solicitud_numero_endoso_en_acs_poliza',
        vId_tipo_de_documento === ENDOSO ? vNumero_solicitud_numero_endoso_en_acs_poliza : null
      )
      .input('vAsunto_del_endoso', vId_tipo_de_documento === ENDOSO ? vAsunto_del_endoso : null)
      .input('vId_aseguradora', Number(vId_aseguradora))
      .input('vId_ramo_de_seguro', Number(vId_ramo_de_seguro))
      .input('vId_grupo_economico', Number(vId_grupo_economico))
      .input('vId_revisor', Number(vId_revisor))
      .input('vPrecio_poliza', vPrecio_poliza)
      .input('vCreador_por_poliza', vCreador_por_poliza)
      .input('vId_ejecutivo_de_cuenta', Number(vId_ejecutivo_de_cuenta))
      .input('vId_facturador', Number(vId_facturador))
      .input('vId_estado_del_documento', Number(vId_estado_del_documento))
      .input('vRevision_snc_poliza', vRevision_snc_poliza)
      .input('vReq_de_cobro_poliza', vReq_de_cobro_poliza)
      .input('vIdEstadoDelProceso', vIdEstadoDelProceso)
      .input('vComentario', vComentario)
      .input('vEditadoPor', vEditadoPor)
      .input('vUsuario', vUsuario)
      .execute('SP_ACTUALIZAR_PAGE_UPDATE');
  } catch (err) {
    console.log(err);
  } finally {
    sql.close();
  }

  return result1;
}
