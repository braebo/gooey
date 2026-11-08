---
'gooey': patch
---

`addMany()` and `bindMany()` type a nullable field's input as the rest of its type builds it. A `number | null` field was typed `never`, so the input `bindMany` builds for it through its `value` option could only be read untyped; now it's an `InputNumber`, and `string | undefined` is a text or color input. A field typed only `null` or `undefined` is any input, since its `value` option decides.
