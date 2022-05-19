const sql = require('mssql');
import { config } from 'db/config.js';

export async function queryConsultarArchivador({ idArchivador }) {
  let result1 = '';
  try {
    let pool = await sql.connect(config);
    result1 = await pool
      .request()
      .input('vIdArchivador', Number(idArchivador))
      .execute('SP_CONSULTAR_DATOS_DE_UN_ARCHIVADOR');
  } catch (err) {
    console.log(err);
  } finally {
    sql.close();
  }

  return result1;
}
