import { queryEmailFacturador } from 'db/queries/queryEmailFacturador';

export default async function handler(req, res) {
  const { query } = req;
  const { idPoliza } = query;
  let result1 = await queryEmailFacturador({ idPoliza });
  res.status(200).json({ results: result1 });
}
