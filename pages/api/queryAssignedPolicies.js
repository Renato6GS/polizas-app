import { queryListadoSiAsignados } from 'db/queries/queryListadoSiAsignados';

export default async function handler(req, res) {
  let result1 = await queryListadoSiAsignados();
  res.status(200).json({ results: result1 });
}
