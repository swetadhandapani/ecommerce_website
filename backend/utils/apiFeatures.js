class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        let keyword = this.queryStr.keyword ? {
            name:{
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        }:{};

        this.query.find({...keyword});
        return this;
    }
    // http://localhost:8000/api/v1/products?category=Books
    filter(){
        const queryStrCopy = {...this.queryStr};

        //removing fields from query
        const removeFields = ["keyword", "limit", "page"];
        removeFields.forEach(field => delete queryStrCopy[field]);

        let queryStr = JSON.stringify(queryStrCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)/g, match => `$${match}`);


        this.query.find(JSON.parse(queryStr));
        
        return this;
    }
    // http://localhost:8000/api/v1/products?page=3
    paginate(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = (currentPage - 1) * resPerPage;
        this.query.limit(resPerPage).skip(skip);
        return this
    }
}

module.exports = APIFeatures;