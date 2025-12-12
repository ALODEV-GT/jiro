export interface Page<T> {
    page: number,
    size: number,
    firstPage: boolean,
    lastPage: boolean,  
    items: T[];
}