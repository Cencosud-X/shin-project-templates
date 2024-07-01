/**
 * @type {import("../../../tools").TContextualizedMethod}
 */
module.exports = async (runner, context) => {
  const { version } = context.getNxInformation();
  const clonedPath = context.getCurrentClonedPath();

  const cmds = [
    // To reference workspace libraries in monorepo
    context.whenNotInstalled("tsconfig-paths", (pkg) => {
      return `npm install -D ${pkg}`;
    }),
    
    // React typings
    context.whenNotInstalled("@types/react", (pkg) => {
      return `npm install -D ${pkg}`;
    }),

    context.whenNotInstalled("@types/react-dom", (pkg) => {
      return `npm install -D ${pkg}`;
    }),

    // Nx generator dependencies
    context.whenNotInstalled("@nx/react", (pkg) => {
      return `npm install -D ${pkg}@${version}`;
    }),

    context.whenNotInstalled("@nx/web", (pkg) => {
      return `npm install -D ${pkg}@${version}`;
    }),

    // Project creation
    `npx nx g @nx/web:app ${context.getProjectName()} --directory=apps/${context.getProjectName()} --projectNameAndRootFormat=as-provided --bundler=webpack`,
    `npx nx g @nx/workspace:rm ${context.getProjectName()}-e2e`,

    // Move specific version files
    `mv ${clonedPath}/scripts/nx16/template/project.json ${clonedPath}/template`,
    `mv ${clonedPath}/scripts/nx16/template/webpack.config.js ${clonedPath}/template`,
    `mv ${clonedPath}/scripts/nx16/template/tsconfig.app.json ${clonedPath}/template`,
    `mv ${clonedPath}/scripts/nx16/template/.eslintrc.json ${clonedPath}/template`,
  ].filter((c) => c != null);

  await runner.execute(cmds, { cwd: context.getRootPath() });
};
