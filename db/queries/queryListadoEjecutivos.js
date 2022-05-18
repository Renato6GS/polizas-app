const sql = require('mssql');
import { config } from 'db/config.js';

export async function queryListadoEjecutivos() {
  let result1 = '';
  try {
    let pool = await sql.connect(config);
    result1 = await pool.request().execute('SP_CONSULTAR_LISTADO_PARA_EJECUTIVO_DE_CUENTA');
  } catch (err) {
    console.log(err);
  } finally {
    sql.close();
  }

  return result1;
}
