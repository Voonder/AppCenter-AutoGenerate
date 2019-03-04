[![Dependency Status](https://david-dm.org/Voonder/AppCenter-AutoGenerate.svg)](https://david-dm.org/Voonder/AppCenter-AutoGenerate.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)

# AppCenter-AutoGenerate

AppCenter-AutoGenerate is a script to generate apps on AppCenter with [Open API AppCenter](https://openapi.appcenter.ms/#/).

## Features

-   Create **app** slot
-   Create **client** distribution group attach on generated apps
-   Add a **team** on generated apps
-   Add permission **manager** on the team (optional)
-   Add a global **distribution group** on generated apps (optional)

> Team & distribution group must be created before on AppCenter for running the script.

## How To

Install all dependencies:

```console
$ npm install
```

Insert your organisation name and AppCenter API Token in `appcenter.js` file:

```javascript
const ORGANISATION = "<ORGANISATION>";
const TOKEN = "<TOKEN>";
```

Run the script:

```console
$ npm run generate
```

Run the script without requesting (dev purpose):

```console
$ npm run generate-fake
```

## License

```
MIT License

Copyright (c) 2019 Voonder

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
