import { Logger } from "@nestjs/common"
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets"
import { Server } from "socket.io"

@WebSocketGateway({ cors: { origin: '*' } })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(AppGateway.name);

    handleConnection(client: any) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: any) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @WebSocketServer()
    server!: Server;

    sendPlaceUpdate(place: any){
        this.server.emit("place-updated", place)
    }

}