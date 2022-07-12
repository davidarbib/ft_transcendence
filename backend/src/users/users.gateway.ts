
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import { Server } from 'socket.io';
import { User, UserStatus } from './entities/user.entity';
import { UsersService } from './users.service';

interface StatusSwitchPayload
{
    userId: string,
    status: string
}

@WebSocketGateway({
  cors: {
    origin: "http://localhost:8000",
    methods: ["GET", "POST"],
  }
})
//export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect {
export class UsersGateway {
  @WebSocketServer()
  server : Server;

  constructor( private readonly usersService: UsersService )
  { }

  //async handleConnection()
  //{
  //  //use cookie to extract user
  //}

  //async handleDisconnect()
  //{
  //  const status : UserStatus = UserStatus.OFFLINE;
  //  await this.usersService.switchStatus(userId, status);
  //  console.log(`userId : ${userId}`);
  //  console.log(`status : ${status}`);
  //  const payload : StatusSwitchPayload = {
  //      userId: userId,
  //      status: status,
  //  }
  //  this.server.emit("switchStatus", payload);
  //}

  async handleStatusSwitch(userId: string, status: UserStatus)
  {
    await this.usersService.switchStatus(userId, status);
    console.log(`userId : ${userId}`);
    console.log(`status : ${status}`);
    const payload : StatusSwitchPayload = {
        userId: userId,
        status: status,
    }
    this.server.emit("switchStatus", payload);
  }
}