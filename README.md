# Maze Game
## Server
### scripts
Follow the steps to start server
```shell
cd server
npm install
# compile 
npm run watch
# execute
npm run dev
```

### api
it will give you a cookie
```
GET /login
```

it will delete your cookie
```
GET /logout
```

it will give you gameinfo
```
GET /gameinfo/:nodeid/:width/:height
```

```
x * * x x
 * o * x x
x * * x x
 x x x x x
```

## resourse
[json to proto](https://json-to-proto.github.io/)