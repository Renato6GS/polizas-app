import { asignarArchivadorPoliza } from 'db/inserts/asignarArchivadorPoliza';

export default async function handler(req, res) {
  const { query } = req;
  const { idPoliza, idArchivador } = query;
  let result1 = await asignarArchivadorPoliza({ idPoliza, idArchivador });
  res.status(200).json({ results: result1 });
}
