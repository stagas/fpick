#!/usr/bin/env node

import filepick from 'fc-filepick'
import { spawn } from 'child_process'

const help = () => {
  console.log('Usage: fpick <path> [options] -- <command> [...args]')
  console.log()
  console.log('Options:')
  console.log('  -r, --repeat   Repeat picker after command ends')
  console.log()
}

if (process.argv.includes('-h') || process.argv.includes('--help')) {
  help()
  process.exit(0)
}

const splitIndex = process.argv.indexOf('--')

if (splitIndex <= 2) {
  help()
  process.exit(1)
}

const eat = (array: string[], el: string) =>
  array.includes(el) && array.splice(array.indexOf(el), 1)[0]

const args = process.argv.slice(2, splitIndex)

const runRepeat = eat(args, '-r') || eat(args, '--repeat')

const folder = args[0]

const restArgs = process.argv.slice(splitIndex + 1)
if (restArgs.length === 0) {
  help()
  process.exit(1)
}

const run = async () => {
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
  }).once('close', () => {
    if (runRepeat) {
      console.log('Finished. Press Enter to pick another...')
      process.stdin.resume()
      process.stdin.once('data', run)
    }
  })
}

run()
