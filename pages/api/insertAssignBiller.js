import { asignarFacturadorPoliza } from 'db/inserts/asignarFacturadorPoliza';

export default async function handler(req, res) {
  const { query } = req;
  let { resultado } = await asignarFacturadorPoliza({ query });
  res.status(200).json({ id_poliza: resultado });
}
