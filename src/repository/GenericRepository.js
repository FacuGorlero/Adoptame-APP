export default class GenericRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getAll = (params) => {
        return this.dao.get(params);
    }

    getBy = (params) => {
        return this.dao.getBy(params);
    }

    create = (doc) => {
        return this.dao.save(doc);
    }

    // BUG FIX: agregar insertMany al repository para poder usarlo desde el controller
    insertMany = (docs) => {
        return this.dao.insert(docs);
    }

    update = (id, doc) => {
        return this.dao.update(id, doc);
    }

    delete = (id) => {
        return this.dao.delete(id);
    }
}
