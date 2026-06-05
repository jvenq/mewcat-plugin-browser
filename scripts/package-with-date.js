#!/usr/bin/env node

/**
 * Package script with date suffix
 * Runs plasmo package and renames the output file with current date
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Get current date in YYYYMMDD format
const getDateSuffix = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

// Main function
const main = () => {
  try {
    console.log('📦 Running plasmo package...')

    // Run plasmo package via pnpm
    execSync('pnpm exec plasmo package', { stdio: 'inherit' })

    const dateSuffix = getDateSuffix()
    const buildDir = path.join(process.cwd(), 'build')
    const originalFile = path.join(buildDir, 'chrome-mv3-prod.zip')
    const newFileName = `chrome-mv3-prod-${dateSuffix}.zip`
    const newFile = path.join(buildDir, newFileName)

    // Check if original file exists
    if (!fs.existsSync(originalFile)) {
      console.error('❌ Error: chrome-mv3-prod.zip not found')
      process.exit(1)
    }

    // Rename file
    console.log(`📝 Renaming to ${newFileName}...`)
    fs.renameSync(originalFile, newFile)

    console.log(`✅ Package created successfully: build/${newFileName}`)
  } catch (error) {
    console.error('❌ Error during packaging:', error.message)
    process.exit(1)
  }
}

main()
