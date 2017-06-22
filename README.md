# Thinkific Integer as a Service



[![Build Status](https://travis-ci.org/otaviosoares/thinkific-challenge-api.svg?branch=master)](https://travis-ci.org/otaviosoares/thinkific-challenge-api)

# Documentation

* [Swagger][DOCS]

# Dependencies

* Node 6+
* MongoDB running locally or just ```docker run -d -p 27017:27017 --name mongo_instance mongo```

# Running locally
```sh
$ cd thinkific-challenge-api
$ npm install
$ npm start
```

# Endpoints

If you want to test locally, just replace https://integer-as-a-service.herokuapp.com by http://localhost:9000

### - Register
```
curl -X POST \
  https://integer-as-a-service.herokuapp.com/v1/user \
  -H 'content-type: application/json' \
  -d '{
  "email": "some@email.com",
  "password": "yourpassword"
}'
```

###### Returns
```
{
    "token": "YOUR-ACCESS-TOKEN"
}
```

### - Login
```
curl -X POST \
  https://integer-as-a-service.herokuapp.com/v1/auth/local \
  -H 'content-type: application/json' \
  -d '{
  "email": "some@email.com",
  "password": "yourpassword"
}'
```

###### Returns
```
{
    "token": "YOUR-ACCESS-TOKEN"
}
```

### - Get current integer

```
curl -X GET \
  https://integer-as-a-service.herokuapp.com/v1/current \
  -H 'authorization: Bearer YOUR-ACCESS-TOKEN' \
  -H 'content-type: application/json'
```

###### Returns
```
{
    "integer": 1
}
```

### - Replace current integer

```
curl -X PUT \
  https://integer-as-a-service.herokuapp.com/v1/current \
  -H 'authorization: Bearer YOUR-ACCESS-TOKEN' \
  -H 'content-type: application/json' \
  -d '{ "integer": 500 }'
```

###### Returns
```
{
    "integer": 500
}
```

### - Get next integer

```
curl -X GET \
  https://integer-as-a-service.herokuapp.com/v1/next \
  -H 'authorization: Bearer YOUR-ACCESS-TOKEN' \
  -H 'content-type: application/json'
```

###### Returns
```
{
    "integer": 2
}
```

[URL]: https://integer-as-a-service.herokuapp.com
[DOCS]: https://integer-as-a-service.herokuapp.com/documentation