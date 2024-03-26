NODE > 20.0 .ts file extenstion unknown issue fix.

# sol-1

"start" :"node --no-warnings=ExperimentalWarning --loader ts-node/esm ./api/src/index.ts"

# sol-2 npm i -D tsx

"start": "tsx ./api/src/index.ts"

# add 'tsc --noEmit' to type chekck (issue with native node modules import statement)

"start": "tsc --noEmit && tsx ./api/src/index.ts"

# sol-3 npm i -D tsimp this better than above on but if there is error on type it will not stop execution

"start": "node --import=tsimp/import ./api/src/index.ts"

# better way npm i -D cross-env package needed for windows

"start": "cross-env TSIMP_DIAG=error node --import=tsimp/import ./api/src/index.ts"
"start": "cross-env TSIMP_DIAG=error nodemon --exec 'node --import=tsimp/import' ./api/src/index.ts"

security practice
//https only cookie

//rate limit = npm i express-rate-limit

//security http headers
npm i helmet
