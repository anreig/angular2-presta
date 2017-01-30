export interface PrestaConfiguration {
    apiKey: string;
    imageApiKey?: string;
    shopUrl: string;
}
export interface Query {
    resource?: string;
    display?: string;
    filter?: any;
    sort?: string;
    limit?: string;
    search?: string;
    imageSizes?: any;
}
