export class GoogleUser {
  displayName: string | undefined;
  email: string | undefined;
  photoUrl: string | undefined;
  id: string | undefined;

  constructor(displayName?: string, email?: string, photoUrl?: string, id?: string) {
    this.displayName = displayName;
    this.email = email;
    this.photoUrl = photoUrl;
    this.id = id;
  }
}
