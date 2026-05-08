import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets"
import { Server } from "socket.io"

@WebSocketGateway({ cors: { origin: '*' } })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    handleConnection(client: any) {
        console.log("Hello")
    }

    handleDisconnect(client: any){
        console.log("World")
    }

    @WebSocketServer()
    server!: Server;

    sendPlaceUpdate(place: any){
        this.server.emit("place-updated", place)
    }

}