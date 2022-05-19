const sql = require('mssql');
import { config } from 'db/config.js';

export async function actualizarEjecutivoDeCuentaAPoliza({ idPoliza, idEjecutivo }) {
  let result1 = '';
  try {
    let pool = await sql.connect(config);
    result1 = await pool
      .request()
      .input('vIdPoliza', Number(idPoliza))
      .input('vIdEjecutivo', Number(idEjecutivo))
      .execute('SP_ACTUALIZAR_EJECUTIVO_DE_CUENTA_A_POLIZA');
  } catch (err) {
    console.log(err);
  } finally {
    sql.close();
  }

  return result1;
}
