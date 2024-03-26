# Backend Development API

This README provides comprehensive details about the backend development API. It includes information about the middleware stack, routes, and endpoints.

## 3 rd party npm packages

The backend API utilizes the following middleware stack:

- [Express](https://www.npmjs.com/package/express): A fast, unopinionated, minimalist web framework for Node.js
- [Cors](https://www.npmjs.com/package/cors): Cross-Origin Resource Sharing middleware for enabling CORS with various options.
- [Morgan](https://www.npmjs.com/package/morgan): HTTP request logger middleware for Node.js.
- [Express Rate Limit](https://www.npmjs.com/package/express-rate-limit): Middleware to limit repeated requests to public APIs and/or endpoints.
- [Helmet](https://www.npmjs.com/package/helmete): Middleware to secure Express apps by setting various HTTP headers.
- [Express Mongo Sanitize](https://www.npmjs.com/package/express-mongo-sanitize): Middleware to sanitize user input coming from POST body, GET queries, and URL params.
- [HPP (HTTP Parameter Pollution)](https://www.npmjs.com/package/hpp): Middleware to prevent HTTP Parameter Pollution attacks.

## Routes and Endpoints

The backend API defines the following routes and endpoints:

    Authentication Routes:
        /api/v1/users/signup: POST request to sign up a new user.
        /api/v1/users/signin: POST request to sign in an existing user.
        /api/v1/users/forgotPassword: POST request to initiate the password reset process.
        /api/v1/users/resetPassword/:token: PATCH request to reset user password using a reset token.

    User Routes(all):
        /api/v1/users/updateMyPassword: PATCH request to update the password of the authenticated user.
        /api/v1/users/updateMe: PATCH request to update user details of the authenticated user.
        /api/v1/users/deleteMe: DELETE request to delete the account of the authenticated user.

    User Routes (admin/moderator):
        /api/v1/users/:id: GET request to retrieve a user by ID.

    User Routes (admin):
        /api/v1/users: GET request to retrieve all users (accessible by admin).
        /api/v1/users: POST request to create a new user (accessible by admin).
        /api/v1/users/:id: PATCH request to update a user by ID (accessible by admin).
        /api/v1/users/:id: DELETE request to delete a user by ID (accessible by admin).


## Fixing TypeScript Error with .ts File Extension Unknown Issue.

Problem Description

When attempting to run a TypeScript file with the .ts extension, the Node.js environment encounters an error due to the unknown file extension.

NODE > 20.0 .ts file extenstion unknown issue fix.

- solution-1
  "start" :"node --no-warnings=ExperimentalWarning --loader ts-node/esm ./api/src/index.ts"

- solution-2 npm i -D tsx
  "start": "tsx ./api/src/index.ts"

add 'tsc --noEmit' to type chekck (issue with native node modules import statement)
"start": "tsc --noEmit && tsx ./api/src/index.ts"

- solution-3 npm i -D tsimp this better than above on but if there is error on type it will not stop execution
  "start": "node --import=tsimp/import ./api/src/index.ts"

- better way npm i -D cross-env package needed for windows
  "start": "cross-env TSIMP_DIAG=error node --import=tsimp/import ./api/src/index.ts"
  "start": "cross-env TSIMP_DIAG=error nodemon --exec 'node --import=tsimp/import' ./api/src/index.ts"
