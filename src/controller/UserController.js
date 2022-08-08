const  knex  = require("../database/knex");
const AppError = require("../utils/AppError");

const {hash, compare} = require("bcrypt")

class UserController{
    async create(request, response){
        const { name, password, email} = request.body;

        if(!password){
            throw new AppError("Senha obrigatoria!")
        }

        const emailExist = await knex("users").where({email}).first();

        console.log(emailExist)

        if(emailExist){
            throw new AppError("Email já esta em uso")
        }

        const passwordHashed = await hash(password, 10)

        await knex("users").insert({
            name,
            email,
            password: passwordHashed
            
        })
        
        return response.json()
    }

    async update(request, response){
        const { name, email, newPassword, oldPassword } = request.body;
        const { id } = request.params;

        const emailExist = await knex("users").where({email}).first();
        if(emailExist){
            throw new AppError("Email já esta em uso")
        }

        const nameExist = await knex("users").where({name}).first();
        if(nameExist){
            throw new AppError("Nome já esta em uso")
        }
        if(newPassword && oldPassword){
            const checkPassword = await knex("users").select("password").where({id}).first()

            const comparePassword = await compare(oldPassword, checkPassword.password)

            if(!comparePassword){
                throw new AppError("Senha antiga incorreta!")
            }           
            
        }


        const passwordHashed = await hash(newPassword, 8)

        await knex("users").where('id', id).update({name: name, email: email, password: passwordHashed})


        response.json()
    }

    async delete(request, response){
        const { id } = request.params;

        await knex("users").where({ id }).delete();

        response.json()
    }
}

module.exports = UserController