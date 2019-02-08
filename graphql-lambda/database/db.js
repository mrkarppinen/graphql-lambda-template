const uuid = require('uuid/v4');
const dynamodb = require('./dynamodb');

exports.findMessages = async (userId) => {
    return new Promise ( (resolve, reject) => {
        const docClient = dynamodb.instance();
        const params = {
            TableName: 'messagesTable',
            IndexName : 'user_index',
            KeyConditionExpression : 'userid = :userVal', 
            ExpressionAttributeValues : {
                ':userVal' : userId       
            }
        };
        docClient.query(params, function(err, data) {
            resolve(err ? {} : data.Items);
        });
    });
};

exports.findUser = (id) => {
    return new Promise ( (resolve, reject) => {
        const docClient = dynamodb.instance();
        const params = {
            TableName: 'usersTable',
            Key: {
                id
            }
        };
        docClient.get(params, function(err, data) {
            if (err) resolve({});
            else resolve(data.Item);
        });
    });
};
    
exports.createMessage = async (userId, content) => {
    return new Promise( (resolve, reject) =>{
        const docClient = dynamodb.instance();
        const params = {
            TableName: 'messagesTable',
            Item: {
                "userid": userId,
                "content": content,
                "id": uuid()
            }
        };
        docClient.put(params, (err, data) => {
            resolve( err ? {} : params.Item );
        });
    });
};

exports.createUser = async (name) => {
    return Promise.resolve({});
};

exports.removeMessage = async (messageId) => {
    return new Promise( (resolve, reject) => {
        const docClient = dynamodb.instance();
        const params = {
        TableName : 'messagesTable',
        Key: {
            id: messageId
        },
        ReturnValues: 'ALL_OLD'
        };

        docClient.delete(params, function(err, data) {
            if (err) {
                resolve({});
            } else {
                resolve(data.Attributes);
            }
        });  
    });
};

exports.getUsers = () => {
    return new Promise( (resolve, reject) => {
        const docClient = dynamodb.instance();
        docClient.scan({
            TableName: 'usersTable',
            Select: 'ALL_ATTRIBUTES'
        }, (err, data) => {
            if (err)
            resolve([]);
            else
            resolve(data.Items);
        });
    });
};
