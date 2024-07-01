/**
 * @type {import("../../../tools").TContextualizedMethod}
 */
module.exports = async (runner, context) => {
  const { version } = context.getNxInformation();
  const clonedPath = context.getCurrentClonedPath();

  const cmds = [
    // For fastest build in typescript location (engine for api)
    context.whenNotInstalled("@swc-node/register", (pkg) => {
      return `npm install -D ${pkg}@^1.6.8`;
    }),
    context.whenNotInstalled("@swc/core", (pkg) => {
      return `npm install -D ${pkg}@^1.3.95`;
    }),
    
    // To reference workspace libraries in monorepo
    context.whenNotInstalled("tsconfig-paths", (pkg) => {
      return `npm install -D ${pkg}`;
    }),

    // Nx generator dependency
    context.whenNotInstalled("@nx/nest", (pkg) => {
      return `npm install -D ${pkg}@${version}`;
    }),

    // Project creation
    `npx nx g @nx/nest:app ${context.getProjectName()} --directory=apps/${context.getProjectName()} --projectNameAndRootFormat=as-provided`,

    // Move specific version files
    `mv ${clonedPath}/scripts/nx16/template/project.json ${clonedPath}/template`,
    `mv ${clonedPath}/scripts/nx16/template/webpack.config.js ${clonedPath}/template`,
  ].filter((c) => c != null);

  await runner.execute(cmds, { cwd: context.getRootPath() });
};
