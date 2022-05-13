const sql = require('mssql');
import { config } from 'db/config.js';

export async function querieAllPolizas() {
  let result1 = '';
  try {
    let pool = await sql.connect(config);
    // let result1 = await pool.request().input('input_parameter', sql.Int, value).query('SELECT * FROM tbl_polizas');
    result1 = await pool.request().query('SELECT * FROM tbl_polizas');

    console.dir(result1);
  } catch (err) {
    console.log(err);
  } finally {
    sql.close();
  }

  return result1;
}
