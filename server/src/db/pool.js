import pg from 'pg';
import { DATABASE } from '../config.js';

const { Pool, types } = pg;

// pg returns NUMERIC and BIGINT as strings; the API works with plain numbers.
types.setTypeParser(types.builtins.NUMERIC, Number.parseFloat);
types.setTypeParser(types.builtins.INT8, Number);

export const pool = new Pool(DATABASE);

export async function query(text, params = []) {
  const { rows } = await pool.query(text, params);
  return rows;
}

// Runs `work` inside a transaction and rolls back if it throws.
export async function withTransaction(work) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
