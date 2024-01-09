# Test script for CLE

# Update `cle.config.ts` with your own parameters first!
# Then run `sh test.sh`

npm run compile-local &&
npm run exec-local -- <blockId> &&
npm run prove-local -- --inputgen <blockId> <expectedStateStr> &&
npm run prove-local -- --test <blockId> <expectedStateStr>

npm run compile &&
npm run exec -- <blockId> &&
npm run prove -- --inputgen <blockId> <expectedStateStr> &&
npm run prove -- --test <blockId> <expectedStateStr>
