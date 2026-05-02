export interface IMySqlDataBase {
  save(): void;
}

class MySQLDatabase implements IMySqlDataBase {
  save() {
    console.log("Saved to MySQL");
  }
}

class UserService {
  constructor(private _repo: IMySqlDataBase) {}

  saveUser() {
    this._repo.save();
  }
}
