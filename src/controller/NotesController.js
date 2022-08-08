const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class NotesController{
    async create(request, response){
        const { title, description, nota, tag } = request.body;
        const { user_id } = request.params;
        

        const idExist = await knex("users").where({id: user_id}).first()
 
        if(!idExist){
            throw new AppError("Usuário nao existente!")
        }
       

        if(nota >= 6 || nota < 1){
            throw new AppError("nota invalida!")
        }

        const note_id = await knex("movie_notes").insert({
            title,
            description,
            nota,
            user_id
        })

        const tagsInsert = tag.map(tag => {
            return {
                user_id,
                note_id,
                tag
            }
        })

        await knex("tags").insert(tagsInsert)

        response.json()
    }

    async delete(request, response){
        const { id } = request.params;
        
        await knex("movie_notes").where({id}).delete()

        response.json()
    }

    async index(request, response){
        const { title, tags, user_id} = request.query;
        let notes;

        if(tags){
            const filterTags = tags.split(',').map(tag => tag.trim())
            
            notes = await knex("tags")
            .select([
                "movie_notes.id",
                "movie_notes.title",
                "movie_notes.nota",
                "movie_notes.description",
                "movie_notes.id",
            ])
            .where("movie_notes.user_id", user_id)
            .whereLike("movie_notes.title", `%${title}%`)
            .whereIn("tag", filterTags)
            .innerJoin("movie_notes", "movie_notes.id", "tags.note_id")
            .orderBy("movie_notes.title")
        }else{
            notes = await knex("movie_notes").where({user_id})
            .whereLike("title", `%${title}%`).orderBy("title")
        }

        const userTags = await knex("tags").where({ user_id})

        const notesWithTags = notes.map(note => {
            const noteTags = userTags.filter(tag => tag.note_id === note.id)
            console.log("FIM PRIMEIRO CONSOLE")
            console.log(noteTags)

            return {
                ...note,
                tags: noteTags
            }
        })

       

        response.json(notesWithTags)


    }

    async show(request, response){
        const { id } = request.params;

        const note = await knex("movie_notes").where( {id}).first()
        const tags = await knex("tags").where({note_id: id})

        if(note === undefined){
            throw new AppError("Nota não encontrada!")
        }
        return response.json ({
            ...note,
            tags  
        })
               
        
        
        
    }

}

module.exports = NotesController