// Copyright (c) 2021 yichen <d.unicreators@gmail.com>. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.

/// yichen <d.unicreators@gmail.com>
///

import {
    ExpressionType, SqlBinary, SqlColumn, SqlExpression,
    SqlOrderby, SqlSelect, SqlUpdate, SqlDelete, SqlInsert,
    SqlTable, SqlValue, SqlLimit, SqlGroupby, SqlAlias,
    SqlAssign, SqlSum, SqlCount, SqlMin, SqlMax, SqlIn
} from "./expr";
import { MySQLExpressionParser } from "./parser";

const _isString = (value: any): value is string => typeof value === 'string';
const _isObject = (value: any): boolean => typeof value === 'object' && !Array.isArray(value);
const _isNullOrUndefined = (value: any): boolean => value === undefined || value === null;

const parser = new MySQLExpressionParser();

const normalize_assign_items = (sets: Array<SqlAssign | { column: string, value: any }>): Array<SqlAssign> =>
    (sets || []).map(s => {
        if (s instanceof SqlAssign) return s;
        if (_isObject(s) && s.column)
            return $assign(s.column, s.value);
        return undefined;
    }).filter(v => !_isNullOrUndefined(v));

export const $insert = (table: SqlTable | string,
    ...sets: Array<SqlAssign | { column: string, value: any }>): { sql: string, values: Array<any> } =>
    parser.parse(new SqlInsert(normalize($table)(table), normalize_assign_items(sets)));

export const $update = (table: SqlTable | string,
    sets: Array<SqlAssign | { column: string, value: any }>, opts?: {
        where: SqlBinary
    }): { sql: string, values: Array<any> } => {
    return parser.parse(new SqlUpdate(normalize($table)(table),
        normalize_assign_items(sets), opts?.where));
}

export const $select = (table: SqlTable | string, opts?: {
    distinct?: boolean,
    limit?: SqlLimit | number,
    selection?: Array<SqlExpression | string | { column: string, alias?: string }>,
    where?: SqlBinary,
    groupby?: SqlGroupby | Array<SqlColumn | string>,
    orderby?: Array<SqlOrderby | string | SqlColumn>
}): { sql: string, values: Array<any> } => {

    let selection: any = opts?.selection;
    if (Array.isArray(selection) && selection.length) {
        selection = selection.map(sel => {
            if (sel instanceof SqlExpression) return sel;
            if (_isString(sel)) return $column(sel);
            if (_isObject(sel) && sel.column) {
                let e: SqlExpression = $column(sel.column);
                if (sel.alias) e = $alias(e, sel.alias);
                return e;
            }
            return undefined;
        }).filter(v => !_isNullOrUndefined(v));
    }
    else
        selection = undefined;

    let groupby: any = opts?.groupby;
    if (Array.isArray(groupby) && groupby.length)
        groupby = $groupby(groupby);
    else if (!(groupby instanceof SqlGroupby))
        groupby = undefined;

    let orderby: any = opts?.orderby;
    if (Array.isArray(orderby) && orderby.length) {
        orderby = orderby.map(o => {
            if (o instanceof SqlOrderby) return o;
            return $orderby(o)
        });
    }
    else
        orderby = undefined;

    let limit: any = opts?.limit;
    if (!_isNullOrUndefined(limit) && Number.isInteger(limit))
        limit = $limit(limit as number);
    else if (!(limit instanceof SqlLimit))
        limit = undefined;

    return parser.parse(new SqlSelect(normalize($table)(table), selection,
        opts?.where, groupby, orderby, opts?.distinct, limit));
}


export const $delete = (table: SqlTable | string, opts?: {
    where: SqlBinary
}): { sql: string, values: Array<any> } =>
    parser.parse(new SqlDelete(normalize($table)(table), opts?.where));

const $compose = (type: ExpressionType, exprs: Array<SqlBinary>): SqlBinary => exprs.reduce((r, c) => new SqlBinary(type, r, c));

export const $and = (...exprs: Array<SqlBinary>): SqlBinary => $compose(ExpressionType.AND, exprs);
export const $or = (...exprs: Array<SqlBinary>): SqlBinary => $compose(ExpressionType.OR, exprs);

const $binary = (type: ExpressionType, column: string | SqlColumn, value: SqlValue | any): SqlBinary =>
    new SqlBinary(type, normalize($column)(column),
        value instanceof SqlValue ? value : $value(value));

export const $eq = (column: SqlColumn | string, value: SqlValue | any): SqlBinary => $binary(ExpressionType.EQ, column, value);
export const $ne = (column: SqlColumn | string, value: SqlValue | any): SqlBinary => $binary(ExpressionType.NE, column, value);
export const $gt = (column: SqlColumn | string, value: SqlValue | any): SqlBinary => $binary(ExpressionType.GT, column, value);
export const $gte = (column: SqlColumn | string, value: SqlValue | any): SqlBinary => $binary(ExpressionType.GTE, column, value);
export const $lt = (column: SqlColumn | string, value: SqlValue | any): SqlBinary => $binary(ExpressionType.LT, column, value);
export const $lte = (column: SqlColumn | string, value: SqlValue | any): SqlBinary => $binary(ExpressionType.LTE, column, value);
export const $contains = (column: SqlColumn | string, value: SqlValue | string): SqlBinary => $binary(ExpressionType.LIKE, column, `%${value}%`);
export const $startsWith = (column: SqlColumn | string, value: SqlValue | string): SqlBinary => $binary(ExpressionType.LIKE, column, `${value}%`);
export const $endsWith = (column: SqlColumn | string, value: SqlValue | string): SqlBinary => $binary(ExpressionType.LIKE, column, `%${value}`);

const normalize = <R = any>(convert: (s: string) => R) => (value: R | string) => _isString(value) ? convert(value) : value;

export const $groupby = (columns: Array<SqlColumn | string>, having?: SqlBinary): SqlGroupby =>
    new SqlGroupby((columns || []).map(normalize($column)), having);

export const $sum = (column: SqlColumn | string): SqlSum => new SqlSum(normalize($column)(column));
export const $count = (column?: SqlColumn | string): SqlCount => new SqlCount(column ? normalize($column)(column) : undefined);
export const $min = (column: SqlColumn | string): SqlMin => new SqlMin(normalize($column)(column));
export const $max = (column: SqlColumn | string): SqlMax => new SqlMax(normalize($column)(column));

export const $orderby = (column: SqlColumn | string, direction?: 'ASC' | 'DESC'): SqlOrderby => new SqlOrderby(normalize($column)(column), direction);
export const $limit = (count: number, offset?: number): SqlLimit => new SqlLimit(count, offset);

export const $column = (name: string): SqlColumn => new SqlColumn(name);
export const $table = (name: string): SqlTable => new SqlTable(name);
export const $value = (value: any): SqlValue => new SqlValue(value);
export const $alias = (expr: SqlExpression, alias: string): SqlAlias => new SqlAlias(expr, alias);


export const $assign = (column: SqlColumn | string, value: SqlValue | any): SqlAssign =>
    new SqlAssign(normalize($column)(column),
        value instanceof SqlValue ? value : $value(value));

export const $in = (column: SqlColumn | string, ...values: Array<any>): SqlIn =>
    new SqlIn(normalize($column)(column), $value(values));


