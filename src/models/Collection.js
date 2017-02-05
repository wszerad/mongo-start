class Collection {
	constructor(opt) {
		this.name = opt.name;
		this.schema = opt.schema || null;
		this.defaults = opt.defaults || {};
		this.indexes = opt.indexes || null;
		this.stub = opt.stub || null;
		this.db = opt.db;
	}

	cleanCollection() {
		return this.db
			.connection()
			.listCollections()
			.toArray()
			.then((collections) => {
				let has = !!collections.find((col) => {
					return col.name === this.name;
				});

				if (has) {
					return this
						.db(this.name)
						.drop()
				}
			})
			.then(() => {
				return this.db
					.connection()
					.createCollection(this.name);
			});
	}

	createIndexes() {
		let indexes = (typeof this.indexes === 'function') ? this.indexes() : this.indexes || [];

		return Promise
			.resolve(indexes)
			.then((indexes) => {
				return Promise.all(indexes.map((index) => {
					let props = Object.assign({
						w: 1
					}, index);

					return this.db(this.name).createIndex(index.field, props);
				}));
			});
	}

	generateStub() {
		let stub = (typeof this.stub === 'function') ? this.stub() : this.stub || [];

		return Promise
			.resolve(stub)
			.then((stub) => {
				return this.db(this.name).insertMany(stub, {j: true});
			});
	}

	prepare() {
		return this
			.cleanCollection()
			.then(() => {
				return this.generateStub();
			})
			.then(() => {
				return this.createIndexes();
			});
	}
}

module.exports = Collection;