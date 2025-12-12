export interface Page<T> {
    page: number,
    size: number,
    items: T[];
}