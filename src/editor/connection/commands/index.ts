export enum Command {
  // build in
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',

  // custom
  UPDATE = 'UPDATE', // server send editor update
  TYPE = 'TYPE', // user type something
  JOIN = 'JOIN', // inform about new connection
  LEAVE = 'LEAVE', // inform about deleted connection
}

export default Command
