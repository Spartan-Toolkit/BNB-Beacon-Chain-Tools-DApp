This folder should be moved to the Web3BNB repo once its fairly functional and imported in as a dep instead

Glossary:
- bbc = BNB Beacon Chain
- bsc = BNB Smart Chain
- bas = BNB Side Chains (Placeholder for future)
- bzk = BNB zkRollup Chain (Placeholder for future)

Deps: `@reduxjs/toolkit`

`index.js` - Export all when pulling in via a dep import
`store.js` - Holds context state for the client/wallet/provider object (BNB Beacon Chain client or BNB Smart Chain provider)
`hooks.js` - All client related hooks