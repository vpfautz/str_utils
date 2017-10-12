# str_utils

Some functions to format strings like in python.

## Usage

```
npm install str_utils
```

## Build & Test

```
npm run build
npm run test
```

## Example

With TypeScript:
```ts
import { fmt } from "str_utils";

console.log(fmt("%5d", 1));
```

With JavaScript:
```js
const { fmt } = require("str_utils").default;

console.log(fmt("%5d", 1));
```
