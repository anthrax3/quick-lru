'use strict';

class QuickLRU {
	constructor(opts) {
		opts = Object.assign({}, opts);

		if (!(opts.maxSize && opts.maxSize > 0)) {
			throw new TypeError('`maxSize` must be a number greater than 0');
		}

		this.maxSize = opts.maxSize;
		this.cache = new Map();
		this.oldCache = new Map();
	}

	_set(key, value) {
		this.cache.set(key, value);

		if (this.cache.size >= this.maxSize) {
			this.oldCache = this.cache;
			this.cache = new Map();
		}
	}

	get(key) {
		if (this.cache.has(key)) {
			return this.cache.get(key);
		}

		if (this.oldCache.has(key)) {
			const value = this.oldCache.get(key);
			this._set(key, value);
			return value;
		}
	}

	set(key, value) {
		if (this.cache.has(key)) {
			this.cache.set(key, value);
		} else {
			this._set(key, value);
		}

		return this;
	}

	has(key) {
		return this.cache.has(key) || this.oldCache.has(key);
	}

	peek(key) {
		if (this.cache.has(key)) {
			return this.cache.get(key);
		}

		if (this.oldCache.has(key)) {
			return this.oldCache.get(key);
		}
	}

	delete(key) {
		this.cache.delete(key);
		this.oldCache.delete(key);
	}

	clear() {
		this.cache.clear();
		this.oldCache.clear();
	}

	* keys() {
		for (const el of this) {
			yield el[0];
		}
	}

	* values() {
		for (const el of this) {
			yield el[1];
		}
	}

	* [Symbol.iterator]() {
		for (const el of this.cache) {
			yield el;
		}

		for (const el of this.oldCache) {
			yield el;
		}
	}

	get size() {
		return this.cache.size + this.oldCache.size;
	}
}

module.exports = QuickLRU;
