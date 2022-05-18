const sql = require('mssql');
import { config } from 'db/config.js';

export async function actualizarReqDeCobro({ idPoliza, reqCobro }) {
  let result1 = '';
  try {
    let pool = await sql.connect(config);
    result1 = await pool
      .request()
      .input('vIdPoliza', Number(idPoliza))
      .input('vReq', reqCobro)
      .execute('SP_ACTUALIZAR_REQ_DE_COBRO');
  } catch (err) {
    console.log(err);
  } finally {
    sql.close();
  }

  return result1;
}
