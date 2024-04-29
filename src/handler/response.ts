export default class ApiResponse {
    success: boolean | null;
    data: any | null;
    error: any | null;
    message?: string;
    constructor(success: boolean, data: any, error?: any, message?: string) {
        this.success = success;
        this.data = data;
        this.error = error;
        this.message = message;
    }
}

export class PaginateResponse extends ApiResponse {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    constructor(success: boolean, data: any, page: number, limit: number, totalCount: number, totalPages: number) {
        super(success, data);
        this.page = page;
        this.limit = limit;
        this.totalCount = totalCount;
        this.totalPages = totalPages;
    }
}

