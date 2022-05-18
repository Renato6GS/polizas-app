const sql = require('mssql');
import { config } from 'db/config.js';

export async function actualizarDocumentoAprobado({ idPoliza, idDoc }) {
  let result1 = '';
  try {
    let pool = await sql.connect(config);
    result1 = await pool
      .request()
      .input('vIdPoliza', Number(idPoliza))
      .input('vIdDoc', idDoc)
      .execute('SP_ACTUALIZAR_DOCUMENTO_APROBADO');
  } catch (err) {
    console.log(err);
  } finally {
    sql.close();
  }

  return result1;
}
