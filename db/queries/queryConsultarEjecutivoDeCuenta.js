const sql = require('mssql');
import { config } from 'db/config.js';

export async function queryConsultarEjecutivoDeCuenta({ idEjecutivo }) {
  let result1 = '';
  try {
    let pool = await sql.connect(config);
    result1 = await pool
      .request()
      .input('vIdEjecutivo', Number(idEjecutivo))
      .execute('SP_CONSULTAR_DATOS_DE_UN_EJECUTIVO_DE_CUENTA');
  } catch (err) {
    console.log(err);
  } finally {
    sql.close();
  }

  return result1;
}
