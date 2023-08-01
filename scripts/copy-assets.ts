import * as shell from 'shelljs';

// copying all the view templates from the 'views' directory to the 'dist/' directory
shell.cp('-R', 'views', 'dist/');
// copying all the static assets from the 'public' directory to the 'dist/' directory
shell.cp('-R', 'public', 'dist/');