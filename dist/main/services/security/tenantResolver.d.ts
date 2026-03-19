import { Request } from 'express';
export interface TenantContext {
    tenantId: string;
    source: 'api_key' | 'header' | 'default';
}
export declare class TenantResolver {
    resolve(req: Request): Promise<TenantContext>;
}
export declare const tenantResolver: TenantResolver;
export default TenantResolver;
//# sourceMappingURL=tenantResolver.d.ts.map