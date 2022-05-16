import { queryCheckLog } from 'db/queries/queryCheckLog.js';

export default async function handler(req, res) {
  const { query } = req;
  const { idPoliza } = query;
  let result1 = await queryCheckLog({ idPoliza });
  res.status(200).json({ results: result1 });
}
