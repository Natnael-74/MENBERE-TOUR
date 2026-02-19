class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.pagination = {};
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|ne|in|nin)\b/g,
      (match) => `$${match}`,
    );

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  search(fields = ['name', 'description']) {
    if (this.queryString.search) {
      const keyword = this.queryString.search.trim();
      this.query = this.query.find({
        $or: fields.map((field) => ({
          [field]: { $regex: keyword, $options: 'i' },
        })),
      });
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt'); // default
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // default exclude
    }
    return this;
  }

  async paginate() {
    const page = Math.max(+this.queryString.page || 1, 1);
    const limit = Math.min(+this.queryString.limit || 10, 100);
    const skip = (page - 1) * limit;

    // Count total documents
    const totalDocs = await this.query.model.countDocuments(
      this.query.getFilter(),
    );
    const totalPages = Math.ceil(totalDocs / limit);

    this.pagination = {
      page,
      limit,
      totalDocs,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default APIFeatures;
