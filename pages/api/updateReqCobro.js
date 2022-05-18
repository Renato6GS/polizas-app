import { actualizarReqDeCobro } from 'db/updates/actualizarReqDeCobro';

export default async function handler(req, res) {
  const { query } = req;
  const { idPoliza, reqCobro } = query;
  let result1 = await actualizarReqDeCobro({ idPoliza, reqCobro });
  res.status(200).json({ results: result1 });
}
