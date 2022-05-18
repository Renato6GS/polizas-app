const sql = require('mssql');
import { config } from 'db/config.js';

export async function queryEmailFacturador({ idPoliza }) {
  let result1 = '';
  try {
    let pool = await sql.connect(config);
    result1 = await pool
      .request()
      .input('vIdPoliza', idPoliza)
      .execute('SP_CONSULTAR_DATOS_DESPUES_DE_ASIGNAR_FACTURADOR');
  } catch (err) {
    console.log(err);
  } finally {
    sql.close();
  }

  return result1;
}
