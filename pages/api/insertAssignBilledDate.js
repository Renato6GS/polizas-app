import { asignarFechaFacturado } from 'db/inserts/asignarFechaFacturado';

export default async function handler(req, res) {
  const { query } = req;
  const { idPoliza } = query;
  let result1 = await asignarFechaFacturado({ idPoliza });
  res.status(200).json({ results: result1 });
}
