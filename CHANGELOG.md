# Changelog

## 0.x

### 0.6.1

-   Deprecate express.js methods.

### 0.6.0

-   feat: Add synchrounous versions of custom fs APIs
-   feat(breaking): fs.readJsonFile now uses a JSON parser instead of a YAML parser
-   feat: Export more useful stuff from the fs module

### 0.5.0

-   feat(breaking): rename fs_utils to fs
-   feat: Add fs.touch
-   feat: Add fs.ensureWriteFile
-   feat: fs now also includes all builtin fs functions
-   feat: fs.safeWriteFile now supports all tpes already supported by node's builtin fs.writeFile
-   chore: Update dependencies

### 0.4.2

-   fix: Import YAML properly

### 0.4.1

-   fix: Improve readYamlFile() function

### 0.4.0

-   feat: Add some useful types

### 0.3.1

-   chore: update dependencies
-   fix: Update yarn.lock to match package.json
-   fix(build): Disable linting on .yarnrc.yml

### 0.3.0

-   feat(breaking): camelize now also camelizes object values
-   feat(breaking): if a unit doesn't exist for convert, check if it exists when converting its name to lower case
-   feat: camelize now also works on arrays
-   chore: Add tests for camelize
-   chore: update dependencies
-   fix(build): Prettier no longer runs on .yarn, so it stops making the prepublish script much slower

### 0.2.0

-   feat(fs): add YAML helper functions
-   chore: update dependencies
-   chore: clean up code
