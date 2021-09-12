// Copyright (c) 2021 yichen <d.unicreators@gmail.com>. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.

/// yichen <d.unicreators@gmail.com>
///

import { ExpressionType, SqlBinary, SqlColumn, SqlDelete, SqlExpression, SqlInsert, SqlOrderby, SqlSelect, SqlTable, SqlUpdate, SqlValue, SqlAlias, SqlLimit, SqlFunc, SqlGroupby, SqlIn } from "./expr";


const operators = {
    [ExpressionType.OR]: 'OR',
    [ExpressionType.AND]: 'AND',
    [ExpressionType.GT]: '>',
    [ExpressionType.GTE]: '>=',
    [ExpressionType.LT]: '<',
    [ExpressionType.LTE]: '<=',
    [ExpressionType.LIKE]: 'LIKE',
    [ExpressionType.ASSIGN]: '=',
    [ExpressionType.EQ]: '=',
    [ExpressionType.NE]: '<>',
}

export class MySQLExpressionParser {

    private segments: Array<string>;
    private values: Array<any>;

    constructor(private parameterPlaceholder: string = '?') { }

    parse(expr: SqlExpression): { sql: string, values: Array<any> } {
        this.segments = [];
        this.values = [];
        this.visit(expr);
        return ({ sql: this.segments.join(''), values: this.values });
    }


    private multi<TExpr = any>(exprs: Array<any>, handleFn: (expr: TExpr) => void) {
        exprs && exprs.length && exprs.forEach((expr, index) => {
            if (index > 0) this.append(`, `);
            handleFn(expr);
        });
    }

    private append(segment: string) { this.segments.push(segment); }

    private visit(expr: SqlExpression) {
        if (!expr) return;
        switch (expr.type) {
            case ExpressionType.SELECT: {
                let _expr = expr as SqlSelect;
                this.append(`SELECT ${_expr.distinct ? 'DISTINCT ' : ''}`);
                if (_expr.selection && _expr.selection.length)
                    this.multi(_expr.selection, expr => this.visit(expr));
                else
                    this.append(`*`);
                this.append(` FROM `);
                this.visit(_expr.from);
                if (_expr.where) {
                    this.append(` WHERE `);
                    this.visit(_expr.where);
                }
                if (_expr.groupby) {
                    this.visit(_expr.groupby);
                }
                if (_expr.sort) {
                    this.append(` ORDER BY `);
                    this.multi(_expr.sort, (_e: SqlOrderby) => {
                        this.visit(_e.column);
                        this.append(`${_e.direction ? ` ${_e.direction}` : ''}`);
                    });
                }
                if (_expr.limit) {
                    this.visit(_expr.limit);
                }
                break;
            }
            case ExpressionType.UPDATE: {
                let _expr = expr as SqlUpdate;
                this.append(`UPDATE `);
                this.visit(_expr.from);
                this.append(` SET (`);
                this.multi((_expr.sets || [])
                    .filter(s => s.type === ExpressionType.ASSIGN),
                    _e => this.visit(_e));
                this.append(`)`);
                if (_expr.where) {
                    this.append(` WHERE `);
                    this.visit(_expr.where);
                }
                break;
            }
            case ExpressionType.INSERT: {
                let _expr = expr as SqlInsert;
                this.append(`INSERT INTO `);
                this.visit(_expr.from);
                if (_expr.sets && _expr.sets.length) {
                    this.append(`(`);
                    this.multi(_expr.sets, _expr => this.visit(_expr.left));
                    this.append(`) VALUES (`);
                    this.multi(_expr.sets, _expr => this.visit(_expr.right));
                    this.append(`)`);
                }
                break;
            }
            case ExpressionType.DELETE: {
                let _expr = expr as SqlDelete;
                this.append(`DELETE FROM `);
                this.visit(_expr.from);
                if (_expr.where) {
                    this.append(` WHERE `);
                    this.visit(_expr.where);
                }
                break;
            }
            case ExpressionType.OR:
            case ExpressionType.AND: {
                let _expr = expr as SqlBinary;
                this.append(`(`);
                this.visit(_expr.left);
                this.append(`) ${operators[expr.type]} (`);
                this.visit(_expr.right);
                this.append(`)`);
                break;
            }
            case ExpressionType.TABLE: {
                let _expr = expr as SqlTable;
                this.append(_expr.name);
                break;
            }
            case ExpressionType.COLUMN: {
                let _expr = expr as SqlColumn;
                this.append(_expr.name);
                break;
            }
            case ExpressionType.ALIAS: {
                let _expr = expr as SqlAlias;
                this.visit(_expr.expr);
                this.append(` AS ${_expr.alias}`);
                break;
            }
            case ExpressionType.EQ:
            case ExpressionType.NE:
            case ExpressionType.GT:
            case ExpressionType.GTE:
            case ExpressionType.LT:
            case ExpressionType.LTE:
            case ExpressionType.LIKE:
            case ExpressionType.ASSIGN: {
                let _expr = expr as SqlBinary;
                this.visit(_expr.left);
                this.append(` ${operators[expr.type]} `);
                this.visit(_expr.right);
                break;
            }
            case ExpressionType.VALUE: {
                this.append(`${this.parameterPlaceholder}`);
                let _expr = expr as SqlValue;
                this.values.push(_expr.value);
                break;
            }
            case ExpressionType.FUNC: {
                let _expr = expr as SqlFunc;
                this.append(`${_expr.FuncName}(`);
                if (_expr.expr) this.visit(_expr.expr);
                else this.append(`*`);
                this.append(`)`);
                break;
            }
            case ExpressionType.IN: {
                let _expr = expr as SqlIn;
                this.visit(_expr.left);
                this.append(` IN(`);
                this.visit(_expr.right);
                this.append(`)`);
                break;
            }
            case ExpressionType.LIMIT: {
                let _expr = expr as SqlLimit;
                this.append(` LIMIT `);
                if (Number.isInteger(_expr.offset))
                    this.append(`${_expr.offset}, `);
                this.append(`${_expr.count}`);
                break;
            }
            case ExpressionType.GROUPBY: {
                let _expr = expr as SqlGroupby;
                this.append(` GROUP BY `);
                this.multi(_expr.columns, _e => this.visit(_e));
                if (_expr.having) {
                    this.append(` HAVING `);
                    this.visit(_expr.having);
                }
                break;
            }
        }
    }
}
