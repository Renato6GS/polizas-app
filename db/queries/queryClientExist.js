const sql = require('mssql');
import { config } from 'db/config.js';

export async function queryClientExist({ noClient = 1 }) {
  let result1 = '';
  try {
    let pool = await sql.connect(config);
    result1 = await pool.request().input('vNoCliente', Number(noClient)).execute('SP_CONSULTAR_EXISTENCIA_DE_CLIENTE');
  } catch (err) {
    console.log(err);
  } finally {
    sql.close();
  }

  return result1;
}
