import { actualizarSNC } from 'db/updates/actualizarSNC';

export default async function handler(req, res) {
  const { query } = req;
  const { idPoliza, snc } = query;
  let result1 = await actualizarSNC({ idPoliza, snc });
  res.status(200).json({ results: result1 });
}
