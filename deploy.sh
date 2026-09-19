#!/bin/bash

# Build the project
npm run build

# Navigate to the build output directory
cd dist

# Initialize git if not already initialized
git init

# Add all files
git add -A

# Commit
git commit -m 'Deploy to GitHub Pages'

# Push to gh-pages branch
git push -f git@github.com:pamudub/pamudub-portfolio.git main:gh-pages

cd -