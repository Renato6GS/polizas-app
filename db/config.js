export const config = {
  user: process.env.USER,
  password: process.env.PASS,
  server: process.env.SERVER, // You can use 'localhost\\instance' to connect to named instance
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
