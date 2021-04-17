# Inrupt-vocab-common-rdf
A rollup.config for producing a js bundle of Inrupt's vocal-common-rdf

In html document header include:

```html
<script defer language="javascript" src="path_to/vocab-common-rdf.bundle.js"></script>
```
The API is exposed to the browser through `SolidRdf`.  For example,

```js
SolidRdf.RDF.type;
```
