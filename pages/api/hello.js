import { querieAllPolizas } from 'db/queries/querieAllPolizas';

export default async function handler(req, res) {
  let result1 = await querieAllPolizas();
  res.status(200).json({ results: result1 });
}
