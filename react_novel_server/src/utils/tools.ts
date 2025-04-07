export function isValidUrl(url: string): boolean {
    const pattern = /^(https?:\/\/)?([\w.-]+)\.([a-zA-Z]{2,6})(\/[\w./?%&=-]*)?$/
    return pattern.test(url)
}
