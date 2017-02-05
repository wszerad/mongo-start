const MongoClient = require('mongodb').MongoClient;
const Collection = require('./src//models/Collection');

let connection = null;

function db(collection) {
	return connection.collection(collection);
}

db.open = function (config) {
	return new Promise((resolve, reject) => {
		MongoClient.connect(config, function (err, handler) {
			if (err)
				return reject(err);

			connection = handler;
			resolve(db);
		});
	});
};

db.close = function () {
	connection.close();
	return db;
};

db.connection = function () {
	return connection;
};

db.prepare = function (collection) {
	collection.db = db;
	let coll = new Collection(collection);

	return coll
		.prepare()
		.then(() => {
			return db;
		});
};

module.exports = db;