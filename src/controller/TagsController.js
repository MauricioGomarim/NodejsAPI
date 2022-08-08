const  knex = require("../database/knex");

class TagsController{
    async index(request,response){

        const { id } = request.params;
        
        const notes = await knex("movie_notes").where({user_id: id})
        
        
       return response.json(notes)
    }
}

module.exports = TagsController