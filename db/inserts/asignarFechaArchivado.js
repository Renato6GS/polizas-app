const sql = require('mssql');
import { config } from 'db/config.js';

export async function asignarFechaArchivado({ idPoliza }) {
  let result1 = '';
  try {
    let pool = await sql.connect(config);
    result1 = await pool.request().input('vIdPoliza', Number(idPoliza)).execute('SP_ASIGNAR_FECHA_ARCHIVADO');
  } catch (err) {
    console.log(err);
  } finally {
    sql.close();
  }

  return result1;
}
