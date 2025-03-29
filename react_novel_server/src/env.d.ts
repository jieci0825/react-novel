declare namespace NodeJS {
    interface ProcessEnv {
        PORT: string
        DB_NAME: string
        DB_PORT: string
        DB_DATABASE: string
        DB_USERNAME: string
        DB_PASSWORD: string
        ALLOWED_ORIGIN: string
    }
}
