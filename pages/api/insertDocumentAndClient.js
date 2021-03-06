import { insertDocumentAndClient } from 'db/inserts/insertDocumentAndClient.js';

export default async function handler(req, res) {
  const { query } = req;
  let { resultado } = await insertDocumentAndClient({ query });
  res.status(200).json({ id_poliza: resultado });
}
