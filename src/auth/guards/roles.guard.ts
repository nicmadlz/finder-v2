import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Role } from "../enums/role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler());
        console.log('requiredRoles:', requiredRoles);

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        console.log('user:', user);

        if (!requiredRoles) return true;
        return requiredRoles.includes(user.role);
    }
}