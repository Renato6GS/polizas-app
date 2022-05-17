import { queryClientForMail } from 'db/queries/queryClientForMail';

export default async function handler(req, res) {
  const { query } = req;
  const { idPoliza } = query;
  let result1 = await queryClientForMail({ idPoliza });
  res.status(200).json({ results: result1 });
}
