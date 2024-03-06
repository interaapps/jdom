npm run build
npx -p typescript tsc src/**/*.js --declaration --allowJs --emitDeclarationOnly --outDir types
git push origin master