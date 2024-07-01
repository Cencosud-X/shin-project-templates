const { witHelper } = require("./../../tools/helper");
/**
 * @type {import("../../tools").TRawMethod}
 */
module.exports = async (runner, args) => {
  // Call script based on the Nx Version!
  const helper = witHelper(args.rc, __dirname);
  await helper.callVersionedPre(runner, args);

  // --------------------------------------------------------
  // Always run this commands (nx version agnostic)
  const context = helper.getContext();
  const { prefix } = context.getNxInformation();
  await runner.execute(
    [
      // We need this pluging for webpack ^^
      context.whenNotInstalled(`webpack-merge`, (pkg) => {
        return `npm install -D ${pkg}@5.9.0`;
      }),
      // React router dom dependency
      context.whenNotInstalled("react-router-dom", (pkg) => {
        return `npm install ${pkg}@6.3.0`;
      }),
    ],
    {
      cwd: context.getRootPath(),
    }
  );

  // Remove the e2e project that nx in some cases (depends on the NX version)
  // nx arbitrary create!
  const e2eToRemove = `${context.getProjectName()}-e2e`;
  if (context.hasProjectInWorkspace(e2eToRemove)) {
    await runner.execute([`npx nx g ${prefix}/workspace:rm ${e2eToRemove}`], {
      cwd: context.getRootPath(),
    });
  }
};
