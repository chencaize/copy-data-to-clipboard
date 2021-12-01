# copy-data-to-clipboard
use the newest api navigator.clipboard.writeText to copy stuff into clipboard

# Installation

```
npm install copy-data-to-clipboard
#or
yarn add copy-data-to-clipboard
```

# How to use it

```js
import copy from "copy-data-to-clipboard";

copy("Text");

copy("Text", {
    debug: true,
    message: "copy error",
});
```
