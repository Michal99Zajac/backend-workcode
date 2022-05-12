import { Socket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'
import jwt from 'jsonwebtoken'
import { UserModel } from '@root/models'

import { config } from '@config'

const { JWT_SECRET } = config

export const auth = async (socket: Socket, next: (err?: ExtendedError) => void) => {
  const token = socket.handshake.auth.token as string | null

  if (!token) return next(new Error('not authorized'))

  try {
    const userId = (jwt.verify(token, JWT_SECRET) as any)._id as string
    const user = await UserModel.findById(userId)

    // enrich socket by user
    socket.handshake.query.user = user as any
  } catch (error) {
    return next(new Error('not authorized'))
  }

  next()
}

export default auth
