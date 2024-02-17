# Test script for CLE

# Update `cle.config.ts` with your own parameters first!
# Then run `sh test.sh`

npm run compile &&
npm run exec -- <blockId> &&
npm run prove -- --inputgen <blockId> <expectedStateStr> &&
npm run prove -- --test <blockId> <expectedStateStr>
