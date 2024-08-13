import { type IUser } from "#app/models/user/user.server.js";

// extend for each prisma model data submission
export interface ISubmission {
  userId: IUser['id']
}
