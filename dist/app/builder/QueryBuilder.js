"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(modelQuery, query) {
        this.exclusions = [];
        this.populatedFields = null;
        this.modelQuery = modelQuery;
        this.query = query;
        for (const key in this.query) {
            if (Object.prototype.hasOwnProperty.call(this.query, key) &&
                key !== 'searchTerm' &&
                (this.query[key] === undefined ||
                    this.query[key] === null ||
                    this.query[key] === '')) {
                delete this.query[key];
            }
        }
    }
    // Range filter
    rangeFilter(field, range) {
        if (range) {
            const [min, max] = range.split('-').map(Number);
            // Check if both min and max are valid numbers
            if (!isNaN(min) && !isNaN(max)) {
                const filter = {
                    [field]: { $gte: min, $lte: max },
                };
                this.modelQuery = this.modelQuery.find(filter);
            }
            else {
                // Handle invalid range values if needed
                //@ts-ignore
                console.warn(`Invalid range value for field ${field}: ${range}`);
            }
        }
        return this;
    }
    //array filter
    arrayFilter(field, values) {
        const newValues = values ? values.split(',') : [];
        if (newValues && newValues.length > 0) {
            const filter = {
                [field]: { $all: newValues },
            };
            this.modelQuery = this.modelQuery.find(filter);
        }
        return this;
    }
    // Popularity sorting
    sortByPopularity() {
        this.modelQuery = this.modelQuery.sort({ popularity: -1 });
        return this;
    }
    // Search
    search(searchableFields) {
        var _a;
        const searchTerm = (_a = this.query) === null || _a === void 0 ? void 0 : _a.searchTerm;
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map(field => ({
                    [field]: { $regex: searchTerm, $options: 'i' },
                })),
            });
        }
        return this;
    }
    // Filter
    filter() {
        const queryObj = Object.assign({}, this.query); // Copy
        // Filtering
        const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
        excludeFields.forEach(el => delete queryObj[el]);
        this.modelQuery = this.modelQuery.find(queryObj);
        return this;
    }
    // Sorting
    sort() {
        var _a, _b, _c;
        const sort = ((_c = (_b = (_a = this.query) === null || _a === void 0 ? void 0 : _a.sort) === null || _b === void 0 ? void 0 : _b.split(',')) === null || _c === void 0 ? void 0 : _c.join(' ')) || '-createdAt';
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    // Pagination
    paginate() {
        var _a, _b;
        const page = Number((_a = this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
        const limit = Number((_b = this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    // Fields selection
    fields() {
        var _a, _b, _c;
        const fields = ((_c = (_b = (_a = this.query) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b.split(',')) === null || _c === void 0 ? void 0 : _c.join(' ')) || '-__v';
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    // Exclude fields
    exclude(fieldString) {
        this.exclusions.push(...fieldString
            .split(',')
            .map(f => f.trim())
            .filter(f => f));
        return this;
    }
    // Apply exclusions
    applyExclusions() {
        if (this.exclusions.length > 0) {
            const exclusionString = this.exclusions
                .map(field => `-${field}`)
                .join(' ');
            this.modelQuery = this.modelQuery.select(exclusionString);
        }
        return this;
    }
    // Populate fields
    populateFields(fields) {
        this.populatedFields = fields;
        return this;
    }
    // Execute populate
    executePopulate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.populatedFields) {
                this.modelQuery.populate(this.populatedFields);
            }
            return this;
        });
    }
    // Count total
    countTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const totalQueries = this.modelQuery.getFilter();
            const total = yield this.modelQuery.model.countDocuments(totalQueries);
            const page = Number((_a = this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
            const limit = Number((_b = this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
            const totalPage = Math.ceil(total / limit);
            return {
                page,
                limit,
                total,
                totalPage,
            };
        });
    }
}
exports.default = QueryBuilder;
