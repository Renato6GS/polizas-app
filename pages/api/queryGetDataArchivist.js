import { queryConsultarArchivador } from 'db/queries/queryConsultarArchivador';

export default async function handler(req, res) {
  const { query } = req;
  const { idArchivador } = query;
  let result1 = await queryConsultarArchivador({ idArchivador });
  res.status(200).json({ results: result1 });
}
