import { actualizarCheckLog } from 'db/updates/actualizarCheckLog';

export default async function handler(req, res) {
  const { idEstadoDelProceso, comentario, idPoliza, editadoPor, usuario } = req.body;
  let result1 = await actualizarCheckLog({ idEstadoDelProceso, comentario, idPoliza, editadoPor, usuario });
  res.status(200).json({ results: result1 });
}
