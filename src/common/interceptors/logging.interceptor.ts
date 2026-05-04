import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();

        const {method, url} = request;

        const start = Date.now();
        console.log(`[${method}] ${url} - starting`);
        
        return next.handle().pipe(
            tap(() => {
                const duration = Date.now() - start;
                console.log(`[${method}] ${url} - ${duration}ms`);
            })
        )
    }
}