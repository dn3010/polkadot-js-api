# metadata update

1. New branch :)
2. `curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "state_getMetadata", "params":[]}' http://localhost:9933`
3. Copy the result (hex-only) into `tstaic.ts`, as of now linked to `v1/static.ts`
4. Rust Metadata tests, `yarn run test packages/types/src/Metadata`
5. Add new class types as required (find missing in Rust code, add)
6. Add all classes to `index.classes.ts`
7. Repeat 4-6 until passing
8. Update parsed JSON to actual output version, `v1/latest.*.json`
9. All tests
10. Make PR
