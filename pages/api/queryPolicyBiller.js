import { queryConsultarFacturadorDePoliza } from 'db/queries/queryConsultarFacturadorDePoliza';

export default async function handler(req, res) {
  const { query } = req;
  const { idPoliza } = query;
  let result1 = await queryConsultarFacturadorDePoliza({ idPoliza });
  res.status(200).json({ results: result1 });
}
