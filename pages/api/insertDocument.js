import { insertDocument } from 'db/inserts/insertDocument.js';

export default async function handler(req, res) {
  const { query } = req;
  let success = await insertDocument({ query });
  res.status(200).json({ estado: success });
}
