import { Document } from 'mongoose';

export interface User extends Document {
  [x: string]: any;
  readonly _id: string;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly status?: string;
}
