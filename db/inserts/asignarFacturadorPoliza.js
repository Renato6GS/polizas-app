const sql = require('mssql');
import { config } from 'db/config.js';

export async function asignarFacturadorPoliza({ query }) {
  const { idPoliza, idFacturador, comentario, editadoPor, usuario } = query;
  let result1 = '';
  try {
    let pool = await sql.connect(config);
    result1 = await pool
      .request()
      .input('vIdPoliza', Number(idPoliza))
      .input('vIdFacturador', Number(idFacturador))
      .input('vComentario', comentario)
      .input('vEditadoPor', editadoPor)
      .input('vUsuario', usuario)
      .execute('SP_ASIGNAR_FACTURADOR');
  } catch (err) {
    console.log(err);
  } finally {
    sql.close();
  }

  return result1;
}
