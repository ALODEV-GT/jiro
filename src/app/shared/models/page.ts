export interface Page<T> {
    page: number,
    size: number,
    isLastPage: boolean,
    items: T[];
}