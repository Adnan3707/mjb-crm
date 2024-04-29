/**
 * Pagination Aggregation
 */

import { PaginateResponse } from "../handler/response";

interface PaginationProps {
    collection: any;
    aggregation: Array<any>;
    page: number;
    limit: number;
    search?: string;
    searchFields?: Array<string>;
    sortBy?: string;
    sortOrder?: string;
}

export async function paginate({ collection, aggregation, page, limit, search, searchFields, sortBy, sortOrder }: PaginationProps) {
    const paginate: any = aggregation;
    const skip = (page - 1) * limit;

    // searching stage
    if (searchFields?.length && search) {
        paginate.push({
            $match: {
                $or: generateSearchFields(searchFields, search),
            },
        });
    }
    // sorting stage
    if (sortBy && sortOrder) {
        paginate.push({ $sort: { [sortBy]: parseInt(sortOrder) } });
    } else {
        paginate.push({ $sort: { '_id': -1 } })
    }
    

    // Facet stage
    paginate.push({
        $facet: {
            data: [
                { $skip: skip },
                { $limit: limit }
            ],
            totalCount: [
                { $group: { _id: null, count: { $sum: 1 } } }
            ]
        }
    });

    
    // @ts-ignore
    const [results] = await collection.aggregate(paginate);

    const totalCount = results.totalCount.length > 0 ? results.totalCount[0].count : 0;
    const totalPages = Math.ceil(totalCount / limit);

    const data = results.data || [];

    return new PaginateResponse(true, data, page, limit, totalCount, totalPages);
}

function generateSearchFields(searchFields: Array<string>, search: string) {
    return searchFields.map((s) => ({ [s]: { $regex: search, $options: "i" } }))
}