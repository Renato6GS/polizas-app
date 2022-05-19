import { queryConsultarEjecutivoDeCuenta } from 'db/queries/queryConsultarEjecutivoDeCuenta';

export default async function handler(req, res) {
  const { query } = req;
  const { idEjecutivo } = query;
  let result1 = await queryConsultarEjecutivoDeCuenta({ idEjecutivo });
  res.status(200).json({ results: result1 });
}
