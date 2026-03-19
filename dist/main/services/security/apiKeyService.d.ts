export interface ApiKey {
    id: string;
    keyHash: string;
    tenantId: string;
    name: string;
    scopes: string[];
    createdAt: number;
    expiresAt?: number;
    rateLimit?: {
        limit: number;
        windowMs: number;
    };
}
export declare class ApiKeyService {
    private readonly redis;
    /** Generate a new API key, store hash in Redis */
    generate(params: {
        tenantId: string;
        name: string;
        scopes?: string[];
        expiresAt?: number;
        rateLimit?: {
            limit: number;
            windowMs: number;
        };
    }): Promise<{
        key: string;
        metadata: ApiKey;
    }>;
    /** Validate API key, returns metadata or null */
    validate(rawKey: string): Promise<ApiKey | null>;
    /** Revoke an API key by hash */
    revoke(rawKey: string): Promise<void>;
    /** List all API keys for a tenant */
    listForTenant(tenantId: string): Promise<ApiKey[]>;
    private hash;
}
export declare const apiKeyService: ApiKeyService;
export default ApiKeyService;
//# sourceMappingURL=apiKeyService.d.ts.map