const MongoClient = require('mongodb').MongoClient;
const Collection = require('./models/Collection');

let connection = null;

function db(collection) {
	return connection.collection(collection);
}

db.open = function (config) {
	return new Promise((resolve, reject)=>{
		MongoClient.connect(config, function(err, handler) {
			if(err)
				return reject(err);

			connection = handler;
			resolve(connection);
		});
	});
};

db.close = function () {
	connection.close();
};

db.connection = function () {
	return connection;
};

db.prepare = function (collection) {
	let coll = new Collection(collection);

	return coll
		.prepare()
		.then(()=>{
			return this;
		});
};

module.exports = db;