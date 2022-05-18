import { actualizarDocumentoAprobado } from 'db/updates/actualizarDocumentoAprobado';

export default async function handler(req, res) {
  const { query } = req;
  const { idPoliza, idDoc } = query;
  let result1 = await actualizarDocumentoAprobado({ idPoliza, idDoc });
  res.status(200).json({ results: result1 });
}
