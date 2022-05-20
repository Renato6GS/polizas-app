import { asignarFechaArchivado } from 'db/inserts/asignarFechaArchivado';

export default async function handler(req, res) {
  const { query } = req;
  const { idPoliza } = query;
  let result1 = await asignarFechaArchivado({ idPoliza });
  res.status(200).json({ results: result1 });
}
