[![Tests](https://github.com/unicreators/sql-parser/actions/workflows/tests.yml/badge.svg)](https://github.com/unicreators/sql-parser/actions/workflows/tests.yml) 
[![npm (scoped)](https://img.shields.io/npm/v/@unicreators/sql-parser)](https://www.npmjs.com/package/@unicreators/sql-parser) 
[![License](https://img.shields.io/npm/l/@unicreators/sql-parser)](LICENSE)

sql-parser is a library that converts expressions into T-SQL.

sql-parser 是一个将表达式转换为 T-SQL 的库。


```ts
import { $select, $gt, $and, $startsWith } from '@unicreators/sql-parser';
let { sql, values } = $select('users', {
    selection: [{ column: 'col1', alias: 'age' }, 'col2'],
    where: $and($gt('col1', 20), $startsWith('col2', 'yichen'))
});
expect(sql).equal('SELECT col1 AS age, col2 FROM users WHERE (col1 > ?) AND (col2 LIKE ?)');
expect(values).deep.equal([20, 'yichen%']);
```

:watermelon: [Example](./tests/index.test.ts)  


## Install

```sh
$ npm install @unicreators/sql-parser
```

## Operators

- $select
- $update
- $insert
- $delete
- $and
- $or
- $eq
- $ne
- $gt
- $gte
- $lt
- $lte
- $contains
- $startsWith
- $endsWith
- $in
- $limit
- $assign
- $min
- $max
- $sum
- $count
- $groupby
- $orderby
- $table
- $column
- $value
- $alias



### License

[MIT](LICENSE)