// Copyright (c) 2021 yichen <d.unicreators@gmail.com>. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.

/// yichen <d.unicreators@gmail.com>
///


export enum ExpressionType {
    SELECT = 0,
    UPDATE,
    DELETE,
    INSERT,

    COLUMN,
    ASSIGN,
    TABLE,

    AND,
    OR,

    EQ,
    NE,
    LIKE,
    GT,
    LT,
    GTE,
    LTE,
    IN,

    VALUE,
    LIMIT,
    ORDERBY,
    GROUPBY,

    ALIAS,
    FUNC

}

export abstract class SqlExpression {
    constructor(public readonly type: ExpressionType) { }
}

export class SqlClause extends SqlExpression {
    constructor(type: ExpressionType) {
        super(type);
    }
}


export class SqlLimit extends SqlClause {
    constructor(public readonly count: number, public readonly offset?: number) {
        super(ExpressionType.LIMIT);
    }
}

export class SqlGroupby extends SqlClause {
    constructor(public readonly columns: Array<SqlColumn>, public readonly having?: SqlBinary) {
        super(ExpressionType.GROUPBY);
    }
}

export class SqlTable extends SqlExpression {
    constructor(public readonly name: string) {
        super(ExpressionType.TABLE);
    }
}

export class SqlAlias extends SqlExpression {
    constructor(public readonly expr: SqlExpression, public readonly alias: string) {
        super(ExpressionType.ALIAS);
    }
}

export class SqlFunc extends SqlExpression {
    constructor(public readonly FuncName: string, public readonly expr?: SqlExpression) {
        super(ExpressionType.FUNC);
    }
}



export class SqlCount extends SqlFunc {
    constructor(public readonly expr?: SqlExpression) {
        super('COUNT', expr);
    }
}

export class SqlSum extends SqlFunc {
    constructor(public readonly expr: SqlExpression) {
        super('SUM', expr);
    }
}

export class SqlMax extends SqlFunc {
    constructor(public readonly expr: SqlExpression) {
        super('MAX', expr);
    }
}

export class SqlMin extends SqlFunc {
    constructor(public readonly expr: SqlExpression) {
        super('MIN', expr);
    }
}

export class SqlColumn extends SqlExpression {
    constructor(public readonly name: string) {
        super(ExpressionType.COLUMN);
    }
}

export class SqlOrderby extends SqlExpression {
    constructor(public readonly column: SqlColumn, public readonly direction?: 'ASC' | 'DESC') {
        super(ExpressionType.ORDERBY);
    }
}

export class SqlValue extends SqlExpression {
    constructor(public readonly value: any) {
        super(ExpressionType.VALUE);
    }
}

export class SqlBinary extends SqlExpression {
    constructor(type: ExpressionType, public readonly left: SqlExpression, public readonly right: SqlExpression) {
        super(type);
    }
}

export class SqlAssign extends SqlBinary {
    constructor(public readonly left: SqlExpression, public readonly right: SqlExpression) {
        super(ExpressionType.ASSIGN, left, right);
    }
}

export class SqlIn extends SqlBinary {
    constructor(public readonly left: SqlColumn, public readonly right: SqlValue) {
        super(ExpressionType.IN, left, right);
    }
}

export class SqlSelect extends SqlExpression {
    constructor(public readonly from: SqlTable,
        public readonly selection?: Array<SqlExpression>,
        public readonly where?: SqlBinary,
        public readonly groupby?: SqlGroupby,
        public readonly sort?: Array<SqlOrderby>,
        public readonly distinct?: boolean,
        public readonly limit?: SqlLimit) {
        super(ExpressionType.SELECT);
    }
}

export class SqlUpdate extends SqlExpression {
    constructor(public readonly from: SqlTable, public readonly sets: Array<SqlBinary>,
        public readonly where?: SqlBinary) {
        super(ExpressionType.UPDATE);
    }
}

export class SqlInsert extends SqlExpression {
    constructor(public readonly from: SqlTable, public readonly sets: Array<SqlBinary>) {
        super(ExpressionType.INSERT);
    }
}

export class SqlDelete extends SqlExpression {
    constructor(public readonly from: SqlTable, public readonly where?: SqlBinary) {
        super(ExpressionType.DELETE);
    }
}