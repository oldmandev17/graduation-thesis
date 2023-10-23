class APIFeature {
  query: any
  queryStr: any
  constructor(query: any, queryStr: any) {
    this.query = query
    this.queryStr = queryStr
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: 'i'
          }
        }
      : {}
    this.query = this.query.find({ ...keyword })
    return this
  }

  filter() {
    const queryCopy = { ...this.queryStr }
    const removeFields = ['keyword', 'limit', 'page', 'sortBy', 'orderBy']
    removeFields.forEach((field) => {
      return delete queryCopy[field]
    })
    let queryStr = JSON.stringify(queryCopy)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`)
    this.query = this.query.find(JSON.parse(queryStr))
    return this
  }

  sorting() {
    const sort: any = {}
    if (this.queryStr.sortBy && this.queryStr.orderBy) {
      sort[this.queryStr.sortBy] = this.queryStr.orderBy === 'desc' ? -1 : 1
    }
    this.query = this.query.sort(sort)
    return this
  }

  pagination() {
    const { limit, page } = this.queryStr
    const currentPage = Number(page) || 1
    const skip = limit * (currentPage - 1)
    this.query = this.query.limit(limit).skip(skip)
    return this
  }
}

export = APIFeature
