import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard implements CanActivate{
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        const token = authHeader?.split(" ")[1];

        if(!token){
            throw new UnauthorizedException("Token not found!");
        }

        try{
            this.jwtService.verify(token);
        }catch{
            throw new UnauthorizedException("Invalid token!")
        }
        return true;
    }
}