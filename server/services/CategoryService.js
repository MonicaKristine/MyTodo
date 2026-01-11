class CategoryService {
    constructor(db) {
        this.client = db.sequelize;
        this.Category = db.Category;
        this.Todo = db.Todo;
    }

    async addCategory(name, UserId) {
        return this.Category.create({
            name: name,
            UserId: UserId
        })
    }

    async getCategories(UserId) {
        return this.Category.findAll({
            where: {UserId}
        });
    }

    async getOne(id) {
        return this.Category.findOne({
            where: {id}
        });
    }

    async updateName(id, newName, UserId) {
        return this.Category.update(
            { name: newName },
            { where: {id, UserId} }
        )
    }

    async checkIfDepedent(id) {
        return this.Todo.count({
            where: { CategoryId: id }
        })
    }

    async delete(id, UserId) {
        return this.Category.destroy({
            where: {id, UserId}
        })
    }
}

module.exports = CategoryService;