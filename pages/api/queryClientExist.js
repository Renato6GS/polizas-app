import { queryClientExist } from 'db/queries/queryClientExist.js';

export default async function handler(req, res) {
  const { query } = req;
  const { noClient } = query;
  let result1 = await queryClientExist({ noClient });
  res.status(200).json({ results: result1 });
}
