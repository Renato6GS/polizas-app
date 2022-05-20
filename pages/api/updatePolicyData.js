import { actualizarDatosPoliza } from 'db/updates/actualizarDatosPoliza';

export default async function handler(req, res) {
  let result1 = await actualizarDatosPoliza({ data: req.body });
  res.status(200).json({ results: result1 });
}
