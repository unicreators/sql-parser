"use strict";
// Copyright (c) 2021 yichen <d.unicreators@gmail.com>. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLExpressionParser = void 0;
/// yichen <d.unicreators@gmail.com>
///
var expr_1 = require("./expr");
var operators = (_a = {},
    _a[expr_1.ExpressionType.OR] = 'OR',
    _a[expr_1.ExpressionType.AND] = 'AND',
    _a[expr_1.ExpressionType.GT] = '>',
    _a[expr_1.ExpressionType.GTE] = '>=',
    _a[expr_1.ExpressionType.LT] = '<',
    _a[expr_1.ExpressionType.LTE] = '<=',
    _a[expr_1.ExpressionType.LIKE] = 'LIKE',
    _a[expr_1.ExpressionType.ASSIGN] = '=',
    _a[expr_1.ExpressionType.EQ] = '=',
    _a[expr_1.ExpressionType.NE] = '<>',
    _a[expr_1.ExpressionType.IS] = 'IS',
    _a);
var MySQLExpressionParser = /** @class */ (function () {
    function MySQLExpressionParser(parameterPlaceholder) {
        if (parameterPlaceholder === void 0) { parameterPlaceholder = '?'; }
        this.parameterPlaceholder = parameterPlaceholder;
    }
    MySQLExpressionParser.prototype.parse = function (expr) {
        this.segments = [];
        this.values = [];
        this.visit(expr);
        return ({ sql: this.segments.join(''), values: this.values });
    };
    MySQLExpressionParser.prototype.multi = function (exprs, handleFn) {
        var _this = this;
        exprs && exprs.length && exprs.forEach(function (expr, index) {
            if (index > 0)
                _this.append(", ");
            handleFn(expr);
        });
    };
    MySQLExpressionParser.prototype.append = function (segment) { this.segments.push(segment); };
    MySQLExpressionParser.prototype.visit = function (expr) {
        var _this = this;
        if (!expr)
            return;
        switch (expr.type) {
            case expr_1.ExpressionType.SELECT: {
                var _expr = expr;
                this.append("SELECT " + (_expr.distinct ? 'DISTINCT ' : ''));
                if (_expr.selection && _expr.selection.length)
                    this.multi(_expr.selection, function (expr) { return _this.visit(expr); });
                else
                    this.append("*");
                this.append(" FROM ");
                this.visit(_expr.from);
                if (_expr.where) {
                    this.append(" WHERE ");
                    this.visit(_expr.where);
                }
                if (_expr.groupby) {
                    this.visit(_expr.groupby);
                }
                if (_expr.sort) {
                    this.append(" ORDER BY ");
                    this.multi(_expr.sort, function (_e) {
                        _this.visit(_e.column);
                        _this.append("" + (_e.direction ? " " + _e.direction : ''));
                    });
                }
                if (_expr.limit) {
                    this.visit(_expr.limit);
                }
                break;
            }
            case expr_1.ExpressionType.UPDATE: {
                var _expr = expr;
                this.append("UPDATE ");
                this.visit(_expr.from);
                this.append(" SET (");
                this.multi((_expr.sets || [])
                    .filter(function (s) { return s.type === expr_1.ExpressionType.ASSIGN; }), function (_e) { return _this.visit(_e); });
                this.append(")");
                if (_expr.where) {
                    this.append(" WHERE ");
                    this.visit(_expr.where);
                }
                break;
            }
            case expr_1.ExpressionType.INSERT: {
                var _expr = expr;
                this.append("INSERT INTO ");
                this.visit(_expr.from);
                if (_expr.sets && _expr.sets.length) {
                    this.append("(");
                    this.multi(_expr.sets, function (_expr) { return _this.visit(_expr.left); });
                    this.append(") VALUES (");
                    this.multi(_expr.sets, function (_expr) { return _this.visit(_expr.right); });
                    this.append(")");
                }
                break;
            }
            case expr_1.ExpressionType.DELETE: {
                var _expr = expr;
                this.append("DELETE FROM ");
                this.visit(_expr.from);
                if (_expr.where) {
                    this.append(" WHERE ");
                    this.visit(_expr.where);
                }
                break;
            }
            case expr_1.ExpressionType.OR:
            case expr_1.ExpressionType.AND: {
                var _expr = expr;
                this.append("(");
                this.visit(_expr.left);
                this.append(") " + operators[expr.type] + " (");
                this.visit(_expr.right);
                this.append(")");
                break;
            }
            case expr_1.ExpressionType.TABLE: {
                var _expr = expr;
                this.append(_expr.name);
                break;
            }
            case expr_1.ExpressionType.COLUMN: {
                var _expr = expr;
                this.append(_expr.name);
                break;
            }
            case expr_1.ExpressionType.ALIAS: {
                var _expr = expr;
                this.visit(_expr.expr);
                this.append(" AS " + _expr.alias);
                break;
            }
            case expr_1.ExpressionType.EQ:
            case expr_1.ExpressionType.NE:
            case expr_1.ExpressionType.GT:
            case expr_1.ExpressionType.GTE:
            case expr_1.ExpressionType.LT:
            case expr_1.ExpressionType.LTE:
            case expr_1.ExpressionType.LIKE:
            case expr_1.ExpressionType.ASSIGN:
            case expr_1.ExpressionType.IS: {
                var _expr = expr;
                this.visit(_expr.left);
                this.append(" " + operators[expr.type] + " ");
                this.visit(_expr.right);
                break;
            }
            case expr_1.ExpressionType.CONST: {
                var _expr = expr;
                this.append("" + _expr.constant);
                break;
            }
            case expr_1.ExpressionType.VALUE: {
                this.append("" + this.parameterPlaceholder);
                var _expr = expr;
                this.values.push(_expr.value);
                break;
            }
            case expr_1.ExpressionType.FUNC: {
                var _expr = expr;
                this.append(_expr.FuncName + "(");
                if (_expr.expr)
                    this.visit(_expr.expr);
                else
                    this.append("*");
                this.append(")");
                break;
            }
            case expr_1.ExpressionType.IN: {
                var _expr = expr;
                this.visit(_expr.left);
                this.append(" IN(");
                this.visit(_expr.right);
                this.append(")");
                break;
            }
            case expr_1.ExpressionType.LIMIT: {
                var _expr = expr;
                this.append(" LIMIT ");
                if (Number.isInteger(_expr.offset))
                    this.append(_expr.offset + ", ");
                this.append("" + _expr.count);
                break;
            }
            case expr_1.ExpressionType.GROUPBY: {
                var _expr = expr;
                this.append(" GROUP BY ");
                this.multi(_expr.columns, function (_e) { return _this.visit(_e); });
                if (_expr.having) {
                    this.append(" HAVING ");
                    this.visit(_expr.having);
                }
                break;
            }
        }
    };
    return MySQLExpressionParser;
}());
exports.MySQLExpressionParser = MySQLExpressionParser;
//# sourceMappingURL=parser.js.map