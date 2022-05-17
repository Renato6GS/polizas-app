import { insertDocumentWithoutClient } from 'db/inserts/insertDocumentWithoutClient.js';

export default async function handler(req, res) {
  const { query } = req;
  let { resultado } = await insertDocumentWithoutClient({ query });
  res.status(200).json({ id_poliza: resultado });
}
