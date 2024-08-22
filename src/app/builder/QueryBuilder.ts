/* eslint-disable @typescript-eslint/no-explicit-any */

import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;
  private exclusions: string[] = [];
  private populatedFields: string | null = null;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
    for (const key in this.query) {
      if (
        Object.prototype.hasOwnProperty.call(this.query, key) &&
        key !== 'searchTerm' &&
        (this.query[key] === undefined ||
          this.query[key] === null ||
          this.query[key] === '')
      ) {
        delete this.query[key];
      }
    }
  }

  // Range filter
  rangeFilter<K extends keyof T>(field: K, range: string) {
    if (range) {
      const [min, max] = range.split('-').map(Number);
      // Check if both min and max are valid numbers
      if (!isNaN(min) && !isNaN(max)) {
        const filter: any = {
          [field]: { $gte: min, $lte: max } as any,
        };
        this.modelQuery = this.modelQuery.find(filter);
      } else {
        // Handle invalid range values if needed
        //@ts-ignore
        console.warn(`Invalid range value for field ${field}: ${range}`);
      }
    }
    return this;
  }

  //array filter
  arrayFilter<K extends keyof T>(field: K, values: string) {
    const newValues = values ? values.split(',') : [] 
    if (newValues && newValues.length > 0) {
      const filter: any = {
        [field]: { $all: newValues } as any,
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
  search(searchableFields: string[]) {
    const searchTerm = this.query?.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          field =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as any,
        ),
      });
    }

    return this;
  }

  // Filter
  filter() {
    const queryObj = { ...this.query }; // Copy

    // Filtering
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

    excludeFields.forEach(el => delete queryObj[el]);

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }

  // Sorting
  sort() {
    const sort =
      (this.query?.sort as string)?.split(',')?.join(' ') || '-createdAt';
    this.modelQuery = this.modelQuery.sort(sort as string);

    return this;
  }

  // Pagination
  paginate() {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  // Fields selection
  fields() {
    const fields =
      (this.query?.fields as string)?.split(',')?.join(' ') || '-__v';
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  // Exclude fields
  exclude(fieldString: string) {
    this.exclusions.push(
      ...fieldString
        .split(',')
        .map(f => f.trim())
        .filter(f => f),
    );
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
  populateFields(fields: string) {
    this.populatedFields = fields;
    return this;
  }

  // Execute populate
  async executePopulate() {
    if (this.populatedFields) {
      this.modelQuery.populate(this.populatedFields);
    }
    return this;
  }

  // Count total
  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
