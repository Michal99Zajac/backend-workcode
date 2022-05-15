export enum Command {
  // build in
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',

  // custom
  UPDATE = 'UPDATE', // server send editor update
  TYPE = 'TYPE', // user type something
  JOIN = 'JOIN', // inform about new connection
  LEAVE = 'LEAVE', // inform about deleted connection
  CONTENT_UPDATE = 'CONTENT_UPDATE', // update content sent from user
  CURSOR = 'CURSOR', // user send position about cursor
  CURSOR_UPDATE = 'CURSOR_UPDATE', // server send new position of user cursor
}

export default Command
