const sql = require('mssql');
import { config } from 'db/config.js';

export async function queryListadoArchivadores() {
  let result1 = '';
  try {
    let pool = await sql.connect(config);
    result1 = await pool.request().execute('SP_CONSULTAR_LISTADO_PARA_ARCHIVADOR');
  } catch (err) {
    console.log(err);
  } finally {
    sql.close();
  }

  return result1;
}
