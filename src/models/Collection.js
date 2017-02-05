const indexes = require('../methods/indexes');
const stub = require('../methods/stub');

class Collection {
	constructor(opt) {
		this.name = opt.name;
		this.schema = opt.schema || null;
		this.defaults = opt.defaults || {};
		this.indexes = opt.indexes || null;
		this.stub = opt.stub || null;
	}

	createIndexes() {
		return indexes(this)
			.then(()=>{
				return this;
			});
	}

	generateStub() {
		return stub(this)
			.then(()=>{
				return this;
			});
	}

	prepare() {
		return this.createIndexes()
			.generateStub();
	}
}

module.exports = Collection;