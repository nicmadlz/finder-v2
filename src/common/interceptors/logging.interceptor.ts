import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();

        const { method, url } = request;

        const start = Date.now();
        this.logger.log(`[${method}] ${url} - starting`);

        return next.handle().pipe(
            tap({
                next: () => {
                    const duration = Date.now() - start;
                    this.logger.log(`[${method}] ${url} - ${duration}ms`);
                },
                error: (err) => {
                    const duration = Date.now() - start;
                    this.logger.error(`[${method}] ${url} - ${duration}ms - error: ${err?.message ?? err}`);
                },
            })
        )
    }
}
