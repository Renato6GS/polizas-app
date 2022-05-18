import { queryConsultarTodasLasPolizas } from 'db/queries/queryConsultarTodasLasPolizas';

export default async function handler(req, res) {
  let result1 = await queryConsultarTodasLasPolizas();
  res.status(200).json({ results: result1 });
}
