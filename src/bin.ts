#!/usr/bin/env node

import filepick from 'fc-filepick'
import { spawn } from 'child_process'

const help = () => console.log('Usage: fpick <path> -- <command> [...args]')

if (process.argv.includes('-h') || process.argv.includes('--help')) {
  help()
  process.exit(0)
}

const splitIndex = process.argv.indexOf('--')

if (splitIndex <= 2) {
  help()
  process.exit(1)
}

const folder = process.argv[2]
const restArgs = process.argv.slice(splitIndex + 1)
if (restArgs.length === 0) {
  help()
  process.exit(1)
}

;(async () => {
  const fileLocation = await filepick({
    type: 'file',
    folder,
    question: `Pick from ${folder}:`
  })

  if (!fileLocation) {
    console.log('No file selected. Command was not run.')
    process.exit(1)
  }

  spawn(restArgs[0], [...restArgs.slice(1), fileLocation], {
    stdio: 'inherit'
  })
})()
