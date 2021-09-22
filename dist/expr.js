"use strict";
// Copyright (c) 2021 yichen <d.unicreators@gmail.com>. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlDelete = exports.SqlInsert = exports.SqlUpdate = exports.SqlSelect = exports.SqlIn = exports.SqlAssign = exports.SqlBinary = exports.SqlValue = exports.SqlOrderby = exports.SqlColumn = exports.SqlMin = exports.SqlMax = exports.SqlSum = exports.SqlCount = exports.SqlFunc = exports.SqlAlias = exports.SqlTable = exports.SqlGroupby = exports.SqlLimit = exports.SqlClause = exports.SqlConst = exports.SqlExpression = exports.ExpressionType = void 0;
/// yichen <d.unicreators@gmail.com>
///
var ExpressionType;
(function (ExpressionType) {
    ExpressionType[ExpressionType["SELECT"] = 0] = "SELECT";
    ExpressionType[ExpressionType["UPDATE"] = 1] = "UPDATE";
    ExpressionType[ExpressionType["DELETE"] = 2] = "DELETE";
    ExpressionType[ExpressionType["INSERT"] = 3] = "INSERT";
    ExpressionType[ExpressionType["COLUMN"] = 4] = "COLUMN";
    ExpressionType[ExpressionType["ASSIGN"] = 5] = "ASSIGN";
    ExpressionType[ExpressionType["TABLE"] = 6] = "TABLE";
    ExpressionType[ExpressionType["AND"] = 7] = "AND";
    ExpressionType[ExpressionType["OR"] = 8] = "OR";
    ExpressionType[ExpressionType["EQ"] = 9] = "EQ";
    ExpressionType[ExpressionType["NE"] = 10] = "NE";
    ExpressionType[ExpressionType["LIKE"] = 11] = "LIKE";
    ExpressionType[ExpressionType["GT"] = 12] = "GT";
    ExpressionType[ExpressionType["LT"] = 13] = "LT";
    ExpressionType[ExpressionType["GTE"] = 14] = "GTE";
    ExpressionType[ExpressionType["LTE"] = 15] = "LTE";
    ExpressionType[ExpressionType["IN"] = 16] = "IN";
    ExpressionType[ExpressionType["VALUE"] = 17] = "VALUE";
    ExpressionType[ExpressionType["LIMIT"] = 18] = "LIMIT";
    ExpressionType[ExpressionType["ORDERBY"] = 19] = "ORDERBY";
    ExpressionType[ExpressionType["GROUPBY"] = 20] = "GROUPBY";
    ExpressionType[ExpressionType["ALIAS"] = 21] = "ALIAS";
    ExpressionType[ExpressionType["FUNC"] = 22] = "FUNC";
    ExpressionType[ExpressionType["IS"] = 23] = "IS";
    ExpressionType[ExpressionType["CONST"] = 24] = "CONST";
})(ExpressionType = exports.ExpressionType || (exports.ExpressionType = {}));
var SqlExpression = /** @class */ (function () {
    function SqlExpression(type) {
        this.type = type;
    }
    return SqlExpression;
}());
exports.SqlExpression = SqlExpression;
var SqlConst = /** @class */ (function (_super) {
    __extends(SqlConst, _super);
    function SqlConst(constant) {
        var _this = _super.call(this, ExpressionType.CONST) || this;
        _this.constant = constant;
        return _this;
    }
    return SqlConst;
}(SqlExpression));
exports.SqlConst = SqlConst;
var SqlClause = /** @class */ (function (_super) {
    __extends(SqlClause, _super);
    function SqlClause(type) {
        return _super.call(this, type) || this;
    }
    return SqlClause;
}(SqlExpression));
exports.SqlClause = SqlClause;
var SqlLimit = /** @class */ (function (_super) {
    __extends(SqlLimit, _super);
    function SqlLimit(count, offset) {
        var _this = _super.call(this, ExpressionType.LIMIT) || this;
        _this.count = count;
        _this.offset = offset;
        return _this;
    }
    return SqlLimit;
}(SqlClause));
exports.SqlLimit = SqlLimit;
var SqlGroupby = /** @class */ (function (_super) {
    __extends(SqlGroupby, _super);
    function SqlGroupby(columns, having) {
        var _this = _super.call(this, ExpressionType.GROUPBY) || this;
        _this.columns = columns;
        _this.having = having;
        return _this;
    }
    return SqlGroupby;
}(SqlClause));
exports.SqlGroupby = SqlGroupby;
var SqlTable = /** @class */ (function (_super) {
    __extends(SqlTable, _super);
    function SqlTable(name) {
        var _this = _super.call(this, ExpressionType.TABLE) || this;
        _this.name = name;
        return _this;
    }
    return SqlTable;
}(SqlExpression));
exports.SqlTable = SqlTable;
var SqlAlias = /** @class */ (function (_super) {
    __extends(SqlAlias, _super);
    function SqlAlias(expr, alias) {
        var _this = _super.call(this, ExpressionType.ALIAS) || this;
        _this.expr = expr;
        _this.alias = alias;
        return _this;
    }
    return SqlAlias;
}(SqlExpression));
exports.SqlAlias = SqlAlias;
var SqlFunc = /** @class */ (function (_super) {
    __extends(SqlFunc, _super);
    function SqlFunc(FuncName, expr) {
        var _this = _super.call(this, ExpressionType.FUNC) || this;
        _this.FuncName = FuncName;
        _this.expr = expr;
        return _this;
    }
    return SqlFunc;
}(SqlExpression));
exports.SqlFunc = SqlFunc;
var SqlCount = /** @class */ (function (_super) {
    __extends(SqlCount, _super);
    function SqlCount(expr) {
        var _this = _super.call(this, 'COUNT', expr) || this;
        _this.expr = expr;
        return _this;
    }
    return SqlCount;
}(SqlFunc));
exports.SqlCount = SqlCount;
var SqlSum = /** @class */ (function (_super) {
    __extends(SqlSum, _super);
    function SqlSum(expr) {
        var _this = _super.call(this, 'SUM', expr) || this;
        _this.expr = expr;
        return _this;
    }
    return SqlSum;
}(SqlFunc));
exports.SqlSum = SqlSum;
var SqlMax = /** @class */ (function (_super) {
    __extends(SqlMax, _super);
    function SqlMax(expr) {
        var _this = _super.call(this, 'MAX', expr) || this;
        _this.expr = expr;
        return _this;
    }
    return SqlMax;
}(SqlFunc));
exports.SqlMax = SqlMax;
var SqlMin = /** @class */ (function (_super) {
    __extends(SqlMin, _super);
    function SqlMin(expr) {
        var _this = _super.call(this, 'MIN', expr) || this;
        _this.expr = expr;
        return _this;
    }
    return SqlMin;
}(SqlFunc));
exports.SqlMin = SqlMin;
var SqlColumn = /** @class */ (function (_super) {
    __extends(SqlColumn, _super);
    function SqlColumn(name) {
        var _this = _super.call(this, ExpressionType.COLUMN) || this;
        _this.name = name;
        return _this;
    }
    return SqlColumn;
}(SqlExpression));
exports.SqlColumn = SqlColumn;
var SqlOrderby = /** @class */ (function (_super) {
    __extends(SqlOrderby, _super);
    function SqlOrderby(column, direction) {
        var _this = _super.call(this, ExpressionType.ORDERBY) || this;
        _this.column = column;
        _this.direction = direction;
        return _this;
    }
    return SqlOrderby;
}(SqlExpression));
exports.SqlOrderby = SqlOrderby;
var SqlValue = /** @class */ (function (_super) {
    __extends(SqlValue, _super);
    function SqlValue(value) {
        var _this = _super.call(this, ExpressionType.VALUE) || this;
        _this.value = value;
        return _this;
    }
    return SqlValue;
}(SqlExpression));
exports.SqlValue = SqlValue;
var SqlBinary = /** @class */ (function (_super) {
    __extends(SqlBinary, _super);
    function SqlBinary(type, left, right) {
        var _this = _super.call(this, type) || this;
        _this.left = left;
        _this.right = right;
        return _this;
    }
    return SqlBinary;
}(SqlExpression));
exports.SqlBinary = SqlBinary;
var SqlAssign = /** @class */ (function (_super) {
    __extends(SqlAssign, _super);
    function SqlAssign(left, right) {
        var _this = _super.call(this, ExpressionType.ASSIGN, left, right) || this;
        _this.left = left;
        _this.right = right;
        return _this;
    }
    return SqlAssign;
}(SqlBinary));
exports.SqlAssign = SqlAssign;
var SqlIn = /** @class */ (function (_super) {
    __extends(SqlIn, _super);
    function SqlIn(left, right) {
        var _this = _super.call(this, ExpressionType.IN, left, right) || this;
        _this.left = left;
        _this.right = right;
        return _this;
    }
    return SqlIn;
}(SqlBinary));
exports.SqlIn = SqlIn;
var SqlSelect = /** @class */ (function (_super) {
    __extends(SqlSelect, _super);
    function SqlSelect(from, selection, where, groupby, sort, distinct, limit) {
        var _this = _super.call(this, ExpressionType.SELECT) || this;
        _this.from = from;
        _this.selection = selection;
        _this.where = where;
        _this.groupby = groupby;
        _this.sort = sort;
        _this.distinct = distinct;
        _this.limit = limit;
        return _this;
    }
    return SqlSelect;
}(SqlExpression));
exports.SqlSelect = SqlSelect;
var SqlUpdate = /** @class */ (function (_super) {
    __extends(SqlUpdate, _super);
    function SqlUpdate(from, sets, where) {
        var _this = _super.call(this, ExpressionType.UPDATE) || this;
        _this.from = from;
        _this.sets = sets;
        _this.where = where;
        return _this;
    }
    return SqlUpdate;
}(SqlExpression));
exports.SqlUpdate = SqlUpdate;
var SqlInsert = /** @class */ (function (_super) {
    __extends(SqlInsert, _super);
    function SqlInsert(from, sets) {
        var _this = _super.call(this, ExpressionType.INSERT) || this;
        _this.from = from;
        _this.sets = sets;
        return _this;
    }
    return SqlInsert;
}(SqlExpression));
exports.SqlInsert = SqlInsert;
var SqlDelete = /** @class */ (function (_super) {
    __extends(SqlDelete, _super);
    function SqlDelete(from, where) {
        var _this = _super.call(this, ExpressionType.DELETE) || this;
        _this.from = from;
        _this.where = where;
        return _this;
    }
    return SqlDelete;
}(SqlExpression));
exports.SqlDelete = SqlDelete;
//# sourceMappingURL=expr.js.map