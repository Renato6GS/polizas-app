export const config = {
  user: process.env.USER,
  password: process.env.PASS,
  server: process.env.SERVER,
  database: process.env.DATABASE,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};
