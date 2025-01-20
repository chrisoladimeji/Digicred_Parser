import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();



const initializeClient = async () => {

  // Debugging statements to check environment variables
  console.log('DB User:', process.env.WORKFLOW_DB_USER);
  console.log('DB Host:', process.env.WORKFLOW_DB_HOST);
  console.log('DB Name:', process.env.WORKFLOW_DB_NAME);
  console.log('DB Password:', process.env.WORKFLOW_DB_PASSWORD);
  console.log('DB Port:', process.env.WORKFLOW_DB_PORT);

  const client = new Client({
    user: process.env.WORKFLOW_DB_USER,
    host: process.env.WORKFLOW_DB_HOST,
    database: process.env.WORKFLOW_DB_NAME,
    password: process.env.WORKFLOW_DB_PASSWORD,
    port: Number(process.env.WORKFLOW_DB_PORT),
  });

  await client.connect().then(() => {
    console.log('Connected to PostgreSQL database');
  }).catch((err: any) => {
    console.error('Connection error', err.stack);
    process.exit(1);
  });

  return client;
};

const clientPromise = initializeClient();

export default clientPromise;
