import { SqlExpression } from "./expr";
export declare class MySQLExpressionParser {
    private parameterPlaceholder;
    private segments;
    private values;
    constructor(parameterPlaceholder?: string);
    parse(expr: SqlExpression): {
        sql: string;
        values: Array<any>;
    };
    private multi;
    private append;
    private visit;
}
