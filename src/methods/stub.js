const db = require('../../index');

module.exports = function (name, stub) {
	return db.connection()
		.listCollections()
		.toArray()
		.then((collections)=>{
			let has = !!collections.find((col)=>{
				return col.name === name;
			});

			stub = (typeof stub === 'function')? stub() : stub || [];

			if (has) {
				return db(name)
					.drop()
					.then(() => {
						return db(name)
							.insertMany(stub, {j:true});
					});
			} else {
				return db(name).insertMany(stub, {j:true});
			}
		});
};