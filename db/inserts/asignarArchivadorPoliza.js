const sql = require('mssql');
import { config } from 'db/config.js';

export async function asignarArchivadorPoliza({ idPoliza, idArchivador }) {
  let result1 = '';
  try {
    let pool = await sql.connect(config);
    result1 = await pool
      .request()
      .input('vIdArchivador', Number(idArchivador))
      .input('vIdPoliza', Number(idPoliza))
      .execute('SP_ASIGNAR_ARCHIVADOR');
  } catch (err) {
    console.log(err);
  } finally {
    sql.close();
  }

  return result1;
}
