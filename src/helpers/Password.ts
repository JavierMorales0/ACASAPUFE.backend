import { hash, compare, genSalt } from "bcrypt";

class Password {
  constructor() {}
  // Create a hash for the password and return it
  public async createHash(password: string) {
    // Generate a salt
    const salt = await genSalt(10);
    // Create the hash
    const pass_hash = await hash(password, salt);
    return pass_hash;
  }

  // Compare the password with the hash
  public async compare(password: string, hash: string) {
    return await compare(password, hash);
  }
}

export default new Password();
