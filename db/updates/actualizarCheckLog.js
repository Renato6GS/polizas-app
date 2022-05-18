const sql = require('mssql');
import { config } from 'db/config.js';

export async function actualizarCheckLog({ idEstadoDelProceso, comentario, idPoliza, editadoPor, usuario }) {
  let result1 = '';
  try {
    let pool = await sql.connect(config);
    result1 = await pool
      .request()
      .input('vIdEstadoDelProceso', Number(idEstadoDelProceso))
      .input('vComentario', comentario)
      .input('vIdPoliza', Number(idPoliza))
      .input('vEditadoPor', editadoPor)
      .input('vUsuario', usuario)
      .execute('SP_ACTUALIZAR_BITACORA');
  } catch (err) {
    console.log(err);
  } finally {
    sql.close();
  }

  return result1;
}
