export class User {
  private _name!: string | undefined;
  private _birthDate!: string | undefined;
  private _gender!: string | undefined;
  private _phone!: string | undefined;
  private _email!: string | undefined;
  private _imageUrl!: string | undefined;

  constructor(name?: string, birthDate?: string, gender?: string, phone?: string, email?: string,imageUrl?:string) {
    this._name = name;
    this._birthDate = birthDate;
    this._gender = gender;
    this._phone = phone;
    this._email = email;
    this._imageUrl = imageUrl;
  }

  // Getter and Setter for Name
  get name(): string | undefined {
    return this._name;
  }

  set name(value:  string | undefined ) {
    this._name = value;
  }

  // Getter and Setter for Birth Date
  get birthDate(): string | undefined {
    return this._birthDate;
  }

  set birthDate(value: string | undefined) {
    this._birthDate = value;
  }

  // Getter and Setter for Gender
  get gender():  string | undefined  {
    return this._gender;
  }

  set gender(value:  string | undefined ) {
    this._gender = value;
  }

  // Getter and Setter for Phone
  get phone():  string | undefined  {
    return this._phone;
  }

  set phone(value:  string | undefined ) {
    this._phone = value;
  }

  // Getter and Setter for Email
  get email():  string | undefined  {
    return this._email;
  }

  set email(value:  string | undefined ) {
    this._email = value;
  }
  get imageUrl():  string | undefined  {
    return this._imageUrl;
  }

  set imageUrl(value:  string | undefined ) {
    this._imageUrl = value;
  }
}
