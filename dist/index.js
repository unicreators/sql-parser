"use strict";
// Copyright (c) 2021 yichen <d.unicreators@gmail.com>. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.$isNotNull = exports.$isNull = exports.$in = exports.$assign = exports.$alias = exports.$value = exports.$table = exports.$column = exports.$limit = exports.$orderby = exports.$max = exports.$min = exports.$count = exports.$sum = exports.$groupby = exports.$endsWith = exports.$startsWith = exports.$contains = exports.$lte = exports.$lt = exports.$gte = exports.$gt = exports.$ne = exports.$eq = exports.$or = exports.$and = exports.$delete = exports.$select = exports.$update = exports.$insert = void 0;
/// yichen <d.unicreators@gmail.com>
///
var expr_1 = require("./expr");
var parser_1 = require("./parser");
var _isString = function (value) { return typeof value === 'string'; };
var _isObject = function (value) { return typeof value === 'object' && !Array.isArray(value); };
var _isNullOrUndefined = function (value) { return value === undefined || value === null; };
var parser = new parser_1.MySQLExpressionParser();
var normalize_assign_items = function (sets) {
    return (sets || []).map(function (s) {
        if (s instanceof expr_1.SqlAssign)
            return s;
        if (_isObject(s) && s.column)
            return (0, exports.$assign)(s.column, s.value);
        return undefined;
    }).filter(function (v) { return !_isNullOrUndefined(v); });
};
var $insert = function (table) {
    var sets = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sets[_i - 1] = arguments[_i];
    }
    return parser.parse(new expr_1.SqlInsert(normalize(exports.$table)(table), normalize_assign_items(sets)));
};
exports.$insert = $insert;
var $update = function (table, sets, opts) {
    return parser.parse(new expr_1.SqlUpdate(normalize(exports.$table)(table), normalize_assign_items(sets), opts === null || opts === void 0 ? void 0 : opts.where));
};
exports.$update = $update;
var $select = function (table, opts) {
    var selection = opts === null || opts === void 0 ? void 0 : opts.selection;
    if (Array.isArray(selection) && selection.length) {
        selection = selection.map(function (sel) {
            if (sel instanceof expr_1.SqlExpression)
                return sel;
            if (_isString(sel))
                return (0, exports.$column)(sel);
            if (_isObject(sel) && sel.column) {
                var e = (0, exports.$column)(sel.column);
                if (sel.alias)
                    e = (0, exports.$alias)(e, sel.alias);
                return e;
            }
            return undefined;
        }).filter(function (v) { return !_isNullOrUndefined(v); });
    }
    else
        selection = undefined;
    var groupby = opts === null || opts === void 0 ? void 0 : opts.groupby;
    if (Array.isArray(groupby) && groupby.length)
        groupby = (0, exports.$groupby)(groupby);
    else if (!(groupby instanceof expr_1.SqlGroupby))
        groupby = undefined;
    var orderby = opts === null || opts === void 0 ? void 0 : opts.orderby;
    if (Array.isArray(orderby) && orderby.length) {
        orderby = orderby.map(function (o) {
            if (o instanceof expr_1.SqlOrderby)
                return o;
            return (0, exports.$orderby)(o);
        });
    }
    else
        orderby = undefined;
    var limit = opts === null || opts === void 0 ? void 0 : opts.limit;
    if (!_isNullOrUndefined(limit) && Number.isInteger(limit))
        limit = (0, exports.$limit)(limit);
    else if (!(limit instanceof expr_1.SqlLimit))
        limit = undefined;
    return parser.parse(new expr_1.SqlSelect(normalize(exports.$table)(table), selection, opts === null || opts === void 0 ? void 0 : opts.where, groupby, orderby, opts === null || opts === void 0 ? void 0 : opts.distinct, limit));
};
exports.$select = $select;
var $delete = function (table, opts) {
    return parser.parse(new expr_1.SqlDelete(normalize(exports.$table)(table), opts === null || opts === void 0 ? void 0 : opts.where));
};
exports.$delete = $delete;
var $compose = function (type, exprs) { return exprs.reduce(function (r, c) { return new expr_1.SqlBinary(type, r, c); }); };
var $and = function () {
    var exprs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        exprs[_i] = arguments[_i];
    }
    return $compose(expr_1.ExpressionType.AND, exprs);
};
exports.$and = $and;
var $or = function () {
    var exprs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        exprs[_i] = arguments[_i];
    }
    return $compose(expr_1.ExpressionType.OR, exprs);
};
exports.$or = $or;
var $binary = function (type, column, value) {
    return new expr_1.SqlBinary(type, normalize(exports.$column)(column), value instanceof expr_1.SqlValue ? value : (0, exports.$value)(value));
};
var $eq = function (column, value) { return $binary(expr_1.ExpressionType.EQ, column, value); };
exports.$eq = $eq;
var $ne = function (column, value) { return $binary(expr_1.ExpressionType.NE, column, value); };
exports.$ne = $ne;
var $gt = function (column, value) { return $binary(expr_1.ExpressionType.GT, column, value); };
exports.$gt = $gt;
var $gte = function (column, value) { return $binary(expr_1.ExpressionType.GTE, column, value); };
exports.$gte = $gte;
var $lt = function (column, value) { return $binary(expr_1.ExpressionType.LT, column, value); };
exports.$lt = $lt;
var $lte = function (column, value) { return $binary(expr_1.ExpressionType.LTE, column, value); };
exports.$lte = $lte;
var $contains = function (column, value) { return $binary(expr_1.ExpressionType.LIKE, column, "%" + value + "%"); };
exports.$contains = $contains;
var $startsWith = function (column, value) { return $binary(expr_1.ExpressionType.LIKE, column, value + "%"); };
exports.$startsWith = $startsWith;
var $endsWith = function (column, value) { return $binary(expr_1.ExpressionType.LIKE, column, "%" + value); };
exports.$endsWith = $endsWith;
var normalize = function (convert) { return function (value) { return _isString(value) ? convert(value) : value; }; };
var $groupby = function (columns, having) {
    return new expr_1.SqlGroupby((columns || []).map(normalize(exports.$column)), having);
};
exports.$groupby = $groupby;
var $sum = function (column) { return new expr_1.SqlSum(normalize(exports.$column)(column)); };
exports.$sum = $sum;
var $count = function (column) { return new expr_1.SqlCount(column ? normalize(exports.$column)(column) : undefined); };
exports.$count = $count;
var $min = function (column) { return new expr_1.SqlMin(normalize(exports.$column)(column)); };
exports.$min = $min;
var $max = function (column) { return new expr_1.SqlMax(normalize(exports.$column)(column)); };
exports.$max = $max;
var $orderby = function (column, direction) { return new expr_1.SqlOrderby(normalize(exports.$column)(column), direction); };
exports.$orderby = $orderby;
var $limit = function (count, offset) { return new expr_1.SqlLimit(count, offset); };
exports.$limit = $limit;
var $column = function (name) { return new expr_1.SqlColumn(name); };
exports.$column = $column;
var $table = function (name) { return new expr_1.SqlTable(name); };
exports.$table = $table;
var $value = function (value) { return new expr_1.SqlValue(value); };
exports.$value = $value;
var $alias = function (expr, alias) { return new expr_1.SqlAlias(expr, alias); };
exports.$alias = $alias;
var $assign = function (column, value) {
    return new expr_1.SqlAssign(normalize(exports.$column)(column), value instanceof expr_1.SqlValue ? value : (0, exports.$value)(value));
};
exports.$assign = $assign;
var $in = function (column) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    return new expr_1.SqlIn(normalize(exports.$column)(column), (0, exports.$value)(values));
};
exports.$in = $in;
var $isNull = function (column) {
    return new expr_1.SqlBinary(expr_1.ExpressionType.IS, normalize(exports.$column)(column), new expr_1.SqlConst('NULL'));
};
exports.$isNull = $isNull;
var $isNotNull = function (column) {
    return new expr_1.SqlBinary(expr_1.ExpressionType.IS, normalize(exports.$column)(column), new expr_1.SqlConst('NOT NULL'));
};
exports.$isNotNull = $isNotNull;
//# sourceMappingURL=index.js.map