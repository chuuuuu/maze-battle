# Maze Game
## Server
### scripts
Follow the steps to start server
```
cd server
npm install
npm run dev
```

### api
it will give you a cookie
```
GET /login
```

it will delete you a cookie
```
GET /logout
```

you can get maze data without session
```
GET /maze
```

you can only get maze data with session
```
GET /maze_with_session
```