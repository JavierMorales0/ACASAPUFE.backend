class Password {
  constructor() {}
  compare(password: string, hash: string) {
    return password === hash;
  }
}

export default new Password();
