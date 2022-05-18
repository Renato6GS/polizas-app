const sql = require('mssql');
import { config } from 'db/config.js';

export async function actualizarSNC({ idPoliza, snc }) {
  let result1 = '';
  try {
    let pool = await sql.connect(config);
    result1 = await pool
      .request()
      .input('vIdPoliza', Number(idPoliza))
      .input('vSNC', snc)
      .execute('SP_ACTUALIZAR_REVISION_SNC_POLIZA');
  } catch (err) {
    console.log(err);
  } finally {
    sql.close();
  }

  return result1;
}
