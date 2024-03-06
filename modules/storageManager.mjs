import pg from "pg";

class DBManager {
    #pool;

    constructor(connectionString) {
        this.#pool = new pg.Pool({
            connectionString,
            ssl: (process.env.DB_SSL === "true") ? process.env.DB_SSL : false
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
        const query = 'UPDATE "public"."Users" SET "name" = $1, "email" = $2, "password" = $3 WHERE id = $4';
        try {
            await this.executeQuery(query, [user.name, user.email, user.pswHash, user.id]);
            // TODO: Handle update success
            console.log('User updated successfully');
        } catch (error) {
            // TODO: Handle update error
            console.error('Error updating user:', error);
        }
        return user;
    }

    async deleteUser(user) {
        const query = 'DELETE FROM "public"."Users" WHERE id = $1 RETURNING *';
        try {
            await this.executeQuery(query, [user.id]);
            // TODO: Handle delete success
            console.log('User deleted successfully');
        } catch (error) {
            // TODO: Handle delete error
            console.error('Error deleting user:', error);
        }
        return user;
    }

    async createUser(user) {
        const query = 'INSERT INTO "public"."Users"("name", "email", "password") VALUES($1, $2, $3) RETURNING id';
        try {
            const result = await this.executeQuery(query, [user.name, user.email, user.pswHash]);
            if (result.length === 1) {
                user.id = result[0].id;
            }
            // TODO: Handle create success
            console.log('User created successfully');
        } catch (error) {
            // TODO: Handle create error
            console.error('Error creating user:', error);
        }
        return user;
    }
}

let connectionString = process.env.ENVIORMENT === "local" ? process.env.DB_CONNECTIONSTRING_LOCAL : process.env.DB_CONNECTIONSTRING_PROD;
// Use your preferred method for getting the connection string

if (connectionString === undefined) {
    throw new Error("You forgot the db connection string");
}

export default new DBManager(connectionString);



/*
// The following is thre examples of how to get the db connection string from the enviorment variables.
// They accomplish the same thing but in different ways.
// It is a judgment call which one is the best. But go for the one you understand the best.

// 1:
let connectionString = process.env.ENVIORMENT == "local" ? process.env.DB_CONNECTIONSTRING_LOCAL : process.env.DB_CONNECTIONSTRING_PROD;

// 2:
connectionString = process.env.DB_CONNECTIONSTRING_LOCAL;
if (process.env.ENVIORMENT != "local") {
    connectionString = process.env.DB_CONNECTIONSTRING_PROD;
}

//3: 
connectionString = process.env["DB_CONNECTIONSTRING_" + process.env.ENVIORMENT.toUpperCase()];


// We are using an enviorment variable to get the db credentials 
if (connectionString == undefined) {
    throw ("You forgot the db connection string");
}
*/