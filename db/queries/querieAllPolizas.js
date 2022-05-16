const sql = require('mssql');
import { config } from 'db/config.js';

export async function querieAllPolizas() {
  let result1 = '';
  try {
    let pool = await sql.connect(config);
    result1 = await pool.request().query('SELECT * FROM tbl_polizas');
  } catch (err) {
    console.log(err);
  } finally {
    sql.close();
  }

  return result1;
}
