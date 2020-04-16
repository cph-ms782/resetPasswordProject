# Reset password projekt
## a security exam project
**Made by:**  
Dennis Ronney Hansen  
Sercan Atici  
Martin Bøgh Sander-Thomsen  
Johan Christian Ryge  

### Before deployment:
##### .env
In root make **.env** file with secret values:

>EMAIL_HOST=email service host  
EMAIL_PORT=Port of email service  
EMAIL_USER=valid@email  
EMAIL_PASS=valid email service password  
SENDER_ADDRESS=valid@email  
REPLYTO_ADDRESS=valid@email  
FORGOT_PASS_SUBJECT_LINE=Reset password  
PORT=3000  
DOMAIN=localhost:3000   #for testing purposes use localhost. Change to real domain on deployment server


##### config/config.json  
this file is made by sequelize init. Change relevant values. If port 3306 is not used this insert
"port": 3307 or whatever port is used:  
>{  
  "development": {  
    "username": "root",  
    "password": null,  
    "database": "database_dev",  
    "host": "127.0.0.1",  
    "dialect": "mysql",  
    "operatorsAliases": false  
  },  
  "test": {  
    "username": "root",  
    "password": null,  
    "database": "database_test",  
    "host": "127.0.0.1",  
    "dialect": "mysql",  
    "operatorsAliases": false  
  },  
  "production": {  
    "username": "root",  
    "password": null,  
    "database": "database_production",  
    "host": "127.0.0.1",  
    "dialect": "mysql",  
    "operatorsAliases": false  
  }  
}  
