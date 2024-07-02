/**
 * @type {import("../../../tools").TContextualizedMethod}
 */
module.exports = async (runner, context) => {
  const { version } = context.getNxInformation();
  const clonedPath = context.getCurrentClonedPath();

  const cmds = [
    // Nx generator dependency
    context.whenNotInstalled("@nrwl/nest", (pkg) => {
      return `npm install -D ${pkg}@${version}`;
    }),
    
    // Swagger Dependencies
    context.whenNotInstalled("@nestjs/swagger", (pkg) => {
      return `npm install ${pkg}@5.0.0`;
    }),
    context.whenNotInstalled("swagger-ui-express", (pkg) => {
      return `npm install ${pkg}@^4.6.2`;
    }),

    // Project creation
    `npx nx g @nrwl/nest:app ${context.getProjectName()}`,

    // Move specific version files
    `mv ${clonedPath}/scripts/nx14/template/project.json ${clonedPath}/template`,
    `mv ${clonedPath}/scripts/nx14/template/webpack.config.js ${clonedPath}/template`,
  ].filter((c) => c != null);

  await runner.execute(cmds, { cwd: context.getRootPath() });
};
