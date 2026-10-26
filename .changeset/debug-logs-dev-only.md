---
'gooey': patch
---

Gooey's debug and trace logging stays out of production builds. Its internal loggers checked only the log level, so an app that set `VITE_FRACTILS_LOG_LEVEL="debug"` (which Vite ships to the production build too) printed a debug line for every new event listener, input and folder in production, each carrying a whole object. Debug and trace output now runs only when `esm-env`'s `DEV` is true; info, warn and error are unchanged.
