export enum CHAT_OPERATION {
  SEND = 'SEND',
  RECIVE = 'RECIVE',
}

export type Message = {
  createdAt: string
  message: string
}
