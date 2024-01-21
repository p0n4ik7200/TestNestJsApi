## Installation

## Database requirements

MySQL 8

```
MYSQL_ROOT_PASSWORD: my_root_password
MYSQL_DATABASE: my_database
MYSQL_USER: my_user
MYSQL_PASSWORD: my_password
```

## NodeJS environment requirements

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## OpenAPI (Swagger)

After running the app, documentation on api methods is available at the following path: http://localhost:3000/swagger (by default)

## Set default admin

#### Execute after app running

Login: `admin` (by default)  
Password: `admin` (by default)

```sql
insert into User (id, name, passwordHash, isAdmin)
values ('6e92b579-f65a-45d7-a54a-8a3e82bcc7d4', 'admin', '$2b$10$zTcpRUh3reiF/6g0SKgoDeEK2Yz5UEKpZ2ycd4y1T4cAaYmt0z/dW', 1);
```