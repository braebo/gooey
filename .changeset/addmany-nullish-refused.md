---
'gooey': minor
---

`addMany` refuses a `null` or `undefined` field with no `value` option, the way `bindMany` does, and throws before any input is built. An `undefined` field used to become a text input reading `'undefined'` while its type said otherwise (an `InputNumber` for a `number | undefined` field), and a `null` one threw "Failed to resolve the input type for the provided options and value." with the inputs ahead of it left in the panel. Give the field a `value` option (`{ count: { value: 0 } }`) and its input is built from that, as before. An untyped call that gave a nullish field only an `options` or `onClick` option, which the option types refuse, used to build a select or a button from it, and is refused now too. Both verbs' refusal now names the verb and the key (`addMany(): "count" is \`undefined\` …`) in place of `bindMany`'s "Invalid binding."
