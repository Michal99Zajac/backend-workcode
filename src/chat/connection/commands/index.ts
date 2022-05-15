export enum Command {
  // build in
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',

  // custom
  SEND = 'SEND', // user send message
  RECIVE = 'RECIVE', // server broadcast message to the users
}

export default Command
