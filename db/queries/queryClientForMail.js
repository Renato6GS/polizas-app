const sql = require('mssql');
import { config } from 'db/config.js';

export async function queryClientForMail({ idPoliza }) {
  let result1 = '';
  console.log('id_poliza es:');
  console.log(idPoliza);
  try {
    let pool = await sql.connect(config);
    result1 = await pool
      .request()
      .input('vIdPoliza', Number(idPoliza))
      .execute('SP_CONSULTAR_DATOS_DE_AVISO_DE_REGISTRO');
  } catch (err) {
    console.log(err);
  } finally {
    sql.close();
  }

  return result1;
}
