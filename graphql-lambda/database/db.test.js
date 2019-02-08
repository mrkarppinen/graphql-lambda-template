
const fs = require('fs');
const dynamodb = require('./dynamodb');
const db = require('./db');
const sinon = require('sinon');
const usersJson = require('../seed-data/users');


describe('DB', () => {
    let stub;
    beforeAll(() => {
        stub = sinon.stub(dynamodb, 'instance').callsFake(() => {
            return {
                scan: (params, callback) => callback(null,{'Items': usersJson}),
                get: (params, callback) => callback(null, {Item: usersJson[0]})
            };
        });
    });

    test('getUsers', async () => {
        const users = await db.getUsers();
        expect(users.length).toBe(2);
        expect(users[0].id).toBe('378872b8-6c37-4ae8-bbce-5778532fdd81');
    });

    test('findUser', async () => {
        const user = await db.findUser('11111');
        expect(user.id).toBe('378872b8-6c37-4ae8-bbce-5778532fdd81');
    });

})