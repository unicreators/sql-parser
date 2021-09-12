import { SqlBinary, SqlColumn, SqlExpression, SqlOrderby, SqlTable, SqlValue, SqlLimit, SqlGroupby, SqlAlias, SqlAssign, SqlSum, SqlCount, SqlMin, SqlMax, SqlIn } from "./expr";
export declare const $insert: (table: SqlTable | string, ...sets: Array<SqlAssign | {
    column: string;
    value: any;
}>) => {
    sql: string;
    values: Array<any>;
};
export declare const $update: (table: SqlTable | string, sets: Array<SqlAssign | {
    column: string;
    value: any;
}>, opts?: {
    where: SqlBinary;
}) => {
    sql: string;
    values: Array<any>;
};
export declare const $select: (table: SqlTable | string, opts?: {
    distinct?: boolean;
    limit?: SqlLimit | number;
    selection?: Array<SqlExpression | string | {
        column: string;
        alias?: string;
    }>;
    where?: SqlBinary;
    groupby?: SqlGroupby | Array<SqlColumn | string>;
    orderby?: Array<SqlOrderby | string | SqlColumn>;
}) => {
    sql: string;
    values: Array<any>;
};
export declare const $delete: (table: SqlTable | string, opts?: {
    where: SqlBinary;
}) => {
    sql: string;
    values: Array<any>;
};
export declare const $and: (...exprs: Array<SqlBinary>) => SqlBinary;
export declare const $or: (...exprs: Array<SqlBinary>) => SqlBinary;
export declare const $eq: (column: SqlColumn | string, value: SqlValue | any) => SqlBinary;
export declare const $ne: (column: SqlColumn | string, value: SqlValue | any) => SqlBinary;
export declare const $gt: (column: SqlColumn | string, value: SqlValue | any) => SqlBinary;
export declare const $gte: (column: SqlColumn | string, value: SqlValue | any) => SqlBinary;
export declare const $lt: (column: SqlColumn | string, value: SqlValue | any) => SqlBinary;
export declare const $lte: (column: SqlColumn | string, value: SqlValue | any) => SqlBinary;
export declare const $contains: (column: SqlColumn | string, value: SqlValue | string) => SqlBinary;
export declare const $startsWith: (column: SqlColumn | string, value: SqlValue | string) => SqlBinary;
export declare const $endsWith: (column: SqlColumn | string, value: SqlValue | string) => SqlBinary;
export declare const $groupby: (columns: Array<SqlColumn | string>, having?: SqlBinary) => SqlGroupby;
export declare const $sum: (column: SqlColumn | string) => SqlSum;
export declare const $count: (column?: SqlColumn | string) => SqlCount;
export declare const $min: (column: SqlColumn | string) => SqlMin;
export declare const $max: (column: SqlColumn | string) => SqlMax;
export declare const $orderby: (column: SqlColumn | string, direction?: 'ASC' | 'DESC') => SqlOrderby;
export declare const $limit: (count: number, offset?: number) => SqlLimit;
export declare const $column: (name: string) => SqlColumn;
export declare const $table: (name: string) => SqlTable;
export declare const $value: (value: any) => SqlValue;
export declare const $alias: (expr: SqlExpression, alias: string) => SqlAlias;
export declare const $assign: (column: SqlColumn | string, value: SqlValue | any) => SqlAssign;
export declare const $in: (column: SqlColumn | string, ...values: Array<any>) => SqlIn;
