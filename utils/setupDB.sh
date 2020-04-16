#sequelize init

sequelize model:create --name User --attributes username:string,email:string,password:string
sequelize model:create --name ResetToken --attributes email:string,token:string,expiration:date,used:integer
sequelize db:migrate
