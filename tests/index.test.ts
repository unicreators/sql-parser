import 'mocha';
import { expect } from 'chai';

import { $alias, $and, $assign, $column, $contains, $count, $delete, $endsWith, $eq, $gt, $in, $insert, $isNotNull, $isNull, $limit, $lt, $lte, $max, $min, $ne, $or, $orderby, $select, $startsWith, $sum, $table, $update } from '../src';

describe('index.test.ts', function () {

    this.timeout(10000);

    it('select', async () => {

        let result = $select('users');
        expect(result.sql).equal('SELECT * FROM users');
        expect(result.values).deep.equal([]);

        result = $select($table('users'), {
            selection: ['col1', 'col2']
        });
        expect(result.sql).equal('SELECT col1, col2 FROM users');
        expect(result.values).deep.equal([]);

        result = $select('users', {
            selection: ['col1', { column: 'col2', alias: 'age' }, $column('col3'), $alias($column('col4'), 'name')]
        });
        expect(result.sql).equal('SELECT col1, col2 AS age, col3, col4 AS name FROM users');
        expect(result.values).deep.equal([]);

        result = $select('users', {
            where: $eq('col1', 10)
        });
        expect(result.sql).equal('SELECT * FROM users WHERE col1 = ?');
        expect(result.values).deep.equal([10]);


        result = $select('users', {
            where: $and($contains('col1', 'abc'), $in('col2', 1, 2, 4, 8))
        });
        expect(result.sql).equal('SELECT * FROM users WHERE (col1 LIKE ?) AND (col2 IN(?))');
        expect(result.values).deep.equal(['%abc%', [1, 2, 4, 8]]);

        result = $select('users', {
            where: $startsWith('col1', 'abc')
        });
        expect(result.sql).equal('SELECT * FROM users WHERE col1 LIKE ?');
        expect(result.values).deep.equal(['abc%']);


        result = $select('users', {
            where: $and($eq('col1', 10), $startsWith('col2', 'abc'))
        });
        expect(result.sql).equal('SELECT * FROM users WHERE (col1 = ?) AND (col2 LIKE ?)');
        expect(result.values).deep.equal([10, 'abc%']);

        result = $select('users', {
            where: $and($eq('col1', 10), $gt('col2', 20), $eq('col3', 'abc'), $lt('col4', 100))
        });
        expect(result.sql).equal('SELECT * FROM users WHERE (((col1 = ?) AND (col2 > ?)) AND (col3 = ?)) AND (col4 < ?)');
        expect(result.values).deep.equal([10, 20, 'abc', 100]);

        result = $select('users', {
            where: $or($and($eq('col1', 10), $gt('col2', 20)), $eq('col3', 'abc'))
        });
        expect(result.sql).equal('SELECT * FROM users WHERE ((col1 = ?) AND (col2 > ?)) OR (col3 = ?)');
        expect(result.values).deep.equal([10, 20, 'abc']);

        result = $select('users', {
            selection: ['col1', $count(), $sum('col2'), $min('col3'), $alias($max('col4'), 'maxAge')],
            groupby: ['col1']
        });
        expect(result.sql).equal('SELECT col1, COUNT(*), SUM(col2), MIN(col3), MAX(col4) AS maxAge FROM users GROUP BY col1');
        expect(result.values).deep.equal([]);

        result = $select('users', {
            orderby: ['col1']
        });
        expect(result.sql).equal('SELECT * FROM users ORDER BY col1');
        expect(result.values).deep.equal([]);

        result = $select('users', {
            orderby: [$orderby('col1'), 'col2', 'col3', $orderby('col4', 'DESC')]
        });
        expect(result.sql).equal('SELECT * FROM users ORDER BY col1, col2, col3, col4 DESC');
        expect(result.values).deep.equal([]);


        result = $select('users', {
            distinct: true
        });
        expect(result.sql).equal('SELECT DISTINCT * FROM users');
        expect(result.values).deep.equal([]);

        result = $select('users', {
            limit: $limit(6)
        });
        expect(result.sql).equal('SELECT * FROM users LIMIT 6');
        expect(result.values).deep.equal([]);

        result = $select('users', {
            limit: $limit(6, 4)
        });
        expect(result.sql).equal('SELECT * FROM users LIMIT 4, 6');
        expect(result.values).deep.equal([]);

        result = $select('users', {
            where: $or($isNull('name'), $isNotNull('level'))
        });
        expect(result.sql).equal('SELECT * FROM users WHERE (name IS NULL) OR (level IS NOT NULL)');
        expect(result.values).deep.equal([]);

    });

    it('update', async () => {

        let result = $update('users', [$assign('col1', 10)]);
        expect(result.sql).equal('UPDATE users SET (col1 = ?)');
        expect(result.values).deep.equal([10]);

        result = $update('users', [$assign('col1', 10), { column: 'col2', value: 'a' }]);
        expect(result.sql).equal('UPDATE users SET (col1 = ?, col2 = ?)');
        expect(result.values).deep.equal([10, 'a']);

        result = $update('users', [$assign('col1', 10), { column: 'col2', value: 'a' }], { where: $ne('col1', 30) });
        expect(result.sql).equal('UPDATE users SET (col1 = ?, col2 = ?) WHERE col1 <> ?');
        expect(result.values).deep.equal([10, 'a', 30]);

    });

    it('insert', async () => {

        let result = $insert('users', $assign('col1', 10));
        expect(result.sql).equal('INSERT INTO users(col1) VALUES (?)');
        expect(result.values).deep.equal([10]);

        result = $insert('users', $assign('col1', 10), { column: 'col2', value: 'a' });
        expect(result.sql).equal('INSERT INTO users(col1, col2) VALUES (?, ?)');
        expect(result.values).deep.equal([10, 'a']);

    });

    it('delete', async () => {

        let result = $delete('users', { where: $lte('col1', 10) });
        expect(result.sql).equal('DELETE FROM users WHERE col1 <= ?');
        expect(result.values).deep.equal([10]);

    });

});

