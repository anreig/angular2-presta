export interface PrestaConfiguration {
    apiKey: string;
    shopUrl: string;
}
export interface Query {
    resource?: string;
    display?: string;
    filter?: Object;
    sort?: string;
    limit?: string;
    search?: string;
}
