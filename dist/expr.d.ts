export declare enum ExpressionType {
    SELECT = 0,
    UPDATE = 1,
    DELETE = 2,
    INSERT = 3,
    COLUMN = 4,
    ASSIGN = 5,
    TABLE = 6,
    AND = 7,
    OR = 8,
    EQ = 9,
    NE = 10,
    LIKE = 11,
    GT = 12,
    LT = 13,
    GTE = 14,
    LTE = 15,
    IN = 16,
    VALUE = 17,
    LIMIT = 18,
    ORDERBY = 19,
    GROUPBY = 20,
    ALIAS = 21,
    FUNC = 22,
    IS = 23,
    CONST = 24
}
export declare abstract class SqlExpression {
    readonly type: ExpressionType;
    constructor(type: ExpressionType);
}
export declare class SqlConst extends SqlExpression {
    readonly constant: String;
    constructor(constant: String);
}
export declare class SqlClause extends SqlExpression {
    constructor(type: ExpressionType);
}
export declare class SqlLimit extends SqlClause {
    readonly count: number;
    readonly offset?: number;
    constructor(count: number, offset?: number);
}
export declare class SqlGroupby extends SqlClause {
    readonly columns: Array<SqlColumn>;
    readonly having?: SqlBinary;
    constructor(columns: Array<SqlColumn>, having?: SqlBinary);
}
export declare class SqlTable extends SqlExpression {
    readonly name: string;
    constructor(name: string);
}
export declare class SqlAlias extends SqlExpression {
    readonly expr: SqlExpression;
    readonly alias: string;
    constructor(expr: SqlExpression, alias: string);
}
export declare class SqlFunc extends SqlExpression {
    readonly FuncName: string;
    readonly expr?: SqlExpression;
    constructor(FuncName: string, expr?: SqlExpression);
}
export declare class SqlCount extends SqlFunc {
    readonly expr?: SqlExpression;
    constructor(expr?: SqlExpression);
}
export declare class SqlSum extends SqlFunc {
    readonly expr: SqlExpression;
    constructor(expr: SqlExpression);
}
export declare class SqlMax extends SqlFunc {
    readonly expr: SqlExpression;
    constructor(expr: SqlExpression);
}
export declare class SqlMin extends SqlFunc {
    readonly expr: SqlExpression;
    constructor(expr: SqlExpression);
}
export declare class SqlColumn extends SqlExpression {
    readonly name: string;
    constructor(name: string);
}
export declare class SqlOrderby extends SqlExpression {
    readonly column: SqlColumn;
    readonly direction?: 'ASC' | 'DESC';
    constructor(column: SqlColumn, direction?: 'ASC' | 'DESC');
}
export declare class SqlValue extends SqlExpression {
    readonly value: any;
    constructor(value: any);
}
export declare class SqlBinary extends SqlExpression {
    readonly left: SqlExpression;
    readonly right: SqlExpression;
    constructor(type: ExpressionType, left: SqlExpression, right: SqlExpression);
}
export declare class SqlAssign extends SqlBinary {
    readonly left: SqlExpression;
    readonly right: SqlExpression;
    constructor(left: SqlExpression, right: SqlExpression);
}
export declare class SqlIn extends SqlBinary {
    readonly left: SqlColumn;
    readonly right: SqlValue;
    constructor(left: SqlColumn, right: SqlValue);
}
export declare class SqlSelect extends SqlExpression {
    readonly from: SqlTable;
    readonly selection?: Array<SqlExpression>;
    readonly where?: SqlBinary;
    readonly groupby?: SqlGroupby;
    readonly sort?: Array<SqlOrderby>;
    readonly distinct?: boolean;
    readonly limit?: SqlLimit;
    constructor(from: SqlTable, selection?: Array<SqlExpression>, where?: SqlBinary, groupby?: SqlGroupby, sort?: Array<SqlOrderby>, distinct?: boolean, limit?: SqlLimit);
}
export declare class SqlUpdate extends SqlExpression {
    readonly from: SqlTable;
    readonly sets: Array<SqlBinary>;
    readonly where?: SqlBinary;
    constructor(from: SqlTable, sets: Array<SqlBinary>, where?: SqlBinary);
}
export declare class SqlInsert extends SqlExpression {
    readonly from: SqlTable;
    readonly sets: Array<SqlBinary>;
    constructor(from: SqlTable, sets: Array<SqlBinary>);
}
export declare class SqlDelete extends SqlExpression {
    readonly from: SqlTable;
    readonly where?: SqlBinary;
    constructor(from: SqlTable, where?: SqlBinary);
}
