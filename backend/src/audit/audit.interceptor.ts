import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
    constructor(private auditService: AuditService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const method = req.method;

        // Only log mutations
        if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
            return next.handle().pipe(
                tap(async () => {
                    const user = req.user;
                    if (user) {
                        await this.auditService.logAction(
                            user.userId,
                            `${method} ${req.route.path}`,
                            req.body,
                            req.ip,
                            req.params?.id
                        );
                    }
                })
            );
        }

        return next.handle();
    }
}
