class UserService {
    constructor(db) {
        this.client = db.sequelize;
        this.User = db.User;
        this.Todo = db.Todo;
        this.Category = db.Category;
    }

    async create(name, email, encryptedPassword, salt) {
        return this.User.create({
            name: name,
            email: email,
            encryptedPassword: encryptedPassword,
            salt: salt
        })
    }

    async getOne(email) {
        return this.User.findOne({
            where: {email: email}
        })
    }

    async checkIfDepedent(id) {
        return this.Category.count({
            where: { UserId: id }
        })
    }

    async delete(id) {
        return this.User.destroy({
            where: {id}
        })
    }
}

module.exports = UserService;