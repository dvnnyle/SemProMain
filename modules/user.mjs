import DBManager from "./storageManager.mjs";

class User {
  constructor() {
    this.email = "";
    this.pswHash = "";
    this.name = "";
    this.id = null;
  }

  async save() {
    try {
      if (this.id === null) {
        return await DBManager.createUser(this);
      } else {
        return await DBManager.updateUser(this);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      throw error; // Propagate the error for handling in the calling code
    }
  }

  async delete() {
    try {
      await DBManager.deleteUser(this);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error; // Propagate the error for handling in the calling code
    }
  }
}

export default User;