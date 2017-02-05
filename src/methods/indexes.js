const db = require('../wrapper');

module.exports = function (name, indexes) {
	return db(name)
		.dropIndexes()
		.then(() => {
			let indexes = (indexes && indexes()) || [];

			return Promise.all(indexes.map((index) => {
				let props = Object.assign({
					w: 1
				}, index);

				return db(name).createIndex(index.field, props);
			}));
		});
};