const sql = require('mssql');
import { config } from 'db/config.js';

export async function deletePolicy({ idPoliza }) {
  let result1 = '';
  try {
    let pool = await sql.connect(config);
    result1 = await pool.request().input('vIdPoliza', Number(idPoliza)).execute('SP_ELIMINAR_POLIZA');
  } catch (err) {
    console.log(err);
  } finally {
    sql.close();
  }

  return result1;
}
