const sql = require('mssql');
import { config } from 'db/config.js';

export async function queryCheckLog({ idPoliza = 1 }) {
  let result1 = '';
  try {
    let pool = await sql.connect(config);
    result1 = await pool.request().input('vIdPoliza', idPoliza).execute('SP_CONSULTAR_BITACORA_DE_CLIENTE');

    console.dir(result1);
  } catch (err) {
    console.log(err);
  } finally {
    sql.close();
  }

  return result1;
}
