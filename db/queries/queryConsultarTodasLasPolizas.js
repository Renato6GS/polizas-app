const sql = require('mssql');
import { config } from 'db/config.js';

export async function queryConsultarTodasLasPolizas() {
  let result1 = '';
  try {
    let pool = await sql.connect(config);
    result1 = await pool.request().execute('SP_CONSULTAR_LISTADO_TODAS_LAS_POLIZAS');
  } catch (err) {
    console.log(err);
  } finally {
    sql.close();
  }

  return result1;
}
