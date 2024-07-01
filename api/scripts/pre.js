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

  await runner.execute(
    [
      // We need this pluging for webpack ^^
      context.whenNotInstalled(`webpack-merge`, (pkg) => {
        return `npm install -D ${pkg}@5.9.0`;
      }),
    ],
    {
      cwd: context.getRootPath(),
    }
  );
};
