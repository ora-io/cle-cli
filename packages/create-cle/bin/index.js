#!/usr/bin/env node

import { defaultInit } from '../dist/index.mjs'
defaultInit().catch((e) => {
  console.error(e)
})
