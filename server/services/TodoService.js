const { Op } = require('sequelize');

class TodoService {
    constructor(db) {
        this.client = db.sequelize;
        this.Todo = db.Todo;
        this.Status = db.Status;
        this.Category = db.Category;
    }

    async create(name, description, CategoryId, StatusId, UserId){
        return this.Todo.create({
            name,
            description,
            CategoryId,
            StatusId,
            UserId
        })
    }

    async getOneTodo(id) {
        return this.Todo.findOne({
            where: {id}
        })
    }

    async getOneStatus(id) {
        return this.Status.findOne({
            where: {id}
        })
    }

    async getOneStatusByName(status) {
        return this.Status.findOne({
            where: {status}
        })
    }

    async getOneCategory(id) {
        return this.Category.findOne({
            where: {id}
        })
    }

    async getAll(UserId) {
        return this.Todo.findAll({
            attributes: ['id', 'name', 'description', 'UserId'],
            include: [
                { model: this.Status, attributes: ['status'] },
                { model: this.Category, attributes: ['name'] }
            ], 
            where: {UserId}
        });
    }

    async getAllExceptDeleted(UserId) {
        return this.Todo.findAll({
            attributes: ['id', 'name', 'description', 'UserId'],
            include: [
                { model: this.Status, attributes: ['status'], 
                    where: {
                        status: { [Op.ne]: 'Deleted' }
                    }
                },
                { model: this.Category, attributes: ['name']}
            ], 
            where: {UserId}
        })
    }

    async getAllDeleted(UserId) {
        return this.Todo.findAll({
            attributes: ['id', 'name', 'description', 'UserId'],
            include: [
                { model: this.Status, attributes: ['status'],
                    where: {
                        status: 'Deleted' 
                    }
                },
                { model: this.Category, attributes: ['name']}
            ], 
            where: {UserId}
        })
    }

    async getStatuses() {
        return this.Status.findAll({
            where: {}
        })
    }

    async updateTodo(UserId, todoId, newName, newDescription, newStatusId, newCategoryId) {
        return this.Todo.update(
            { 
                name: newName,
                description: newDescription,
                StatusId: newStatusId,
                CategoryId: newCategoryId
            },
            {
                where: {UserId, id: todoId}
            }
        )
    }

    async delete(UserId, todoId, statusId) {
        return this.Todo.update(
            { StatusId: statusId },
            { where: {UserId, id: todoId} }
        )
    }

    async deleteFromDatabase(UserId, todoId) { 
        return this.Todo.destroy({ 
            where: {UserId, id: todoId} 
        }) 
    } 
}

module.exports = TodoService;