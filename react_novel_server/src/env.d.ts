declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: string
        PORT: string
        DB_NAME: string
        DB_PORT: any
        DB_HOST: string
        DB_DATABASE: string
        DB_USERNAME: string
        DB_PASSWORD: string
        ALLOWED_ORIGIN: string
    }
}
