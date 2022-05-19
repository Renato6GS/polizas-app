import { queryConsultarPoliza } from 'db/queries/queryConsultarPoliza';

export default async function handler(req, res) {
  const { query } = req;
  const { idPoliza } = query;
  let result1 = await queryConsultarPoliza({ idPoliza });
  res.status(200).json({ results: result1 });
}
