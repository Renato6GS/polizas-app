import { deletePolicy } from 'db/delete/deletePolicy';

export default async function handler(req, res) {
  const { query } = req;
  const { idPoliza } = query;
  let result1 = await deletePolicy({ idPoliza });
  res.status(200).json({ results: result1 });
}
