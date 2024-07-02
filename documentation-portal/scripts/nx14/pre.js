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

    // Docusaurus Dependencies
    context.whenNotInstalled("@docusaurus/core", (pkg) => {
      return `npm install ${pkg}@2.4.1`;
    }),
    context.whenNotInstalled("@docusaurus/preset-classic", (pkg) => {
      return `npm install ${pkg}@2.4.1`;
    }),
    context.whenNotInstalled("@docusaurus/theme-mermaid", (pkg) => {
      return `npm install ${pkg}@2.4.1`;
    }),
    context.whenNotInstalled("redoc", (pkg) => {
      return `npm install ${pkg}@2.0.0`;
    }),

    // Swagger Dependencies
    context.whenNotInstalled("@nestjs/swagger", (pkg) => {
      return `npm install ${pkg}@5.0.0`;
    }),
    context.whenNotInstalled("swagger-ui-express", (pkg) => {
      return `npm install ${pkg}@^4.6.2`;
    }),

    // Project creation
    `npx nx g @nrwl/web:app ${context.getProjectName()}`,
    `npx nx g @nrwl/workspace:rm ${context.getProjectName()}-e2e`,

    // Move specific version files
    `mv ${clonedPath}/scripts/nx14/template/project.json ${clonedPath}/template`,
    `mv ${clonedPath}/scripts/nx14/template/webpack.config.js ${clonedPath}/template`,
    `mv ${clonedPath}/scripts/nx14/template/tsconfig.app.json ${clonedPath}/template`,
  ].filter((c) => c != null);

  await runner.execute(cmds, { cwd: context.getRootPath() });
};
