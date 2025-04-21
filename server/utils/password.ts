// import bcrypt from "bcrypt"
import { SALT_ROUNDS } from "./constants"

// export async function saltAndHashPassword(plainPassword: string) {
//   const salt = await bcrypt.genSalt(SALT_ROUNDS)
//   const hash = await bcrypt.hash(plainPassword, salt)
//   return hash
// }

export function saltAndHashPassword(plainPassword: string){
  const hash = plainPassword;
  return hash;
}