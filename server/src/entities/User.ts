export class User {
  id!: number;
  createdAt = new Date();
  updatedAt = new Date();
  username!: string;
  email!: string;
  password!: string;
}
