import pg from "pg";

class DBManager {
  #pool;

  constructor(connectionString) {
    this.#pool = new pg.Pool({
      connectionString,
      ssl: process.env.DB_SSL === "true" ? process.env.DB_SSL : false,
    });
  }

  async executeQuery(query, params = []) {
    const client = await this.#pool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async updateUser(user) {
    const query =
      'UPDATE users SET "name" = $1, "email" = $2, "password" = $3 WHERE id = $4';
    try {
      await this.executeQuery(query, [
        user.name,
        user.email,
        user.pswHash, 
        user.id,
      ]);
      console.log('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      throw error; 
    }
    return user;
  }

  async deleteUser(user) {
    const query =
      'DELETE FROM users WHERE id = $1 RETURNING *';
    try {
      await this.executeQuery(query, [user.id]);
      console.log('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error; 
    }
    return user;
  }

  async createUser(user) {
    const query =
      'INSERT INTO users("name", "email", "password") VALUES($1, $2, $3) RETURNING id';
    try {
      const result = await this.executeQuery(query, [
        user.name,
        user.email,
        user.password, 
      ]);
      if (result.length === 1) {
        user.id = result[0].id;
      }
      console.log('User created successfully');
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; 
    }
    return user;
  }
}

let connectionString =
  process.env.ENVIRONMENT === "production"
    ? process.env.DB_CONNECTIONSTRING_PROD
    : process.env.DB_CONNECTIONSTRING_LOCAL;

if (process.env.ENVIRONMENT === "production" && connectionString === undefined) {
  throw new Error("You forgot the db connection string for production environment");
}


export default new DBManager(connectionString);
