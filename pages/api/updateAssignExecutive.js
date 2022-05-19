import { actualizarEjecutivoDeCuentaAPoliza } from 'db/updates/actualizarEjecutivoDeCuentaAPoliza';

export default async function handler(req, res) {
  const { query } = req;
  const { idPoliza, idEjecutivo } = query;
  let result1 = await actualizarEjecutivoDeCuentaAPoliza({ idPoliza, idEjecutivo });
  res.status(200).json({ results: result1 });
}
