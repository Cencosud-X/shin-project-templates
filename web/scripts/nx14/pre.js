/**
 * @type {import("../../../tools").TContextualizedMethod}
 */
module.exports = async (runner, context) => {
  const { version } = context.getNxInformation();
  const clonedPath = context.getCurrentClonedPath();

  const cmds = [
    // Nx generator dependency
    context.whenNotInstalled("@nrwl/web", (pkg) => {
      return `npm install -D ${pkg}@${version}`;
    }),

    // Project creation
    `npx nx g @nrwl/web:app ${context.getProjectName()}`,
    `npx nx g @nrwl/workspace:rm ${context.getProjectName()}-e2e`,

    // Move specific version files
    `mv ${clonedPath}/scripts/nx14/template/project.json ${clonedPath}/template`,
    `mv ${clonedPath}/scripts/nx14/template/webpack.config.js ${clonedPath}/template`,
    `mv ${clonedPath}/scripts/nx14/template/tsconfig.app.json ${clonedPath}/template`,
    `mv ${clonedPath}/scripts/nx14/template/.babelrc ${clonedPath}/template`,
    `mv ${clonedPath}/scripts/nx14/template/.eslintrc.json ${clonedPath}/template`,
  ].filter((c) => c != null);

  await runner.execute(cmds, { cwd: context.getRootPath() });
};
