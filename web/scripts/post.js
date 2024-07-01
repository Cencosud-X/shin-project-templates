const { witHelper } = require("./../../tools/helper");
/**
 * @type {import("../../tools").TRawMethod}
 */
module.exports = async (runner, args) => {
  // Call script based on the Nx Version!
  const helper = witHelper(args.rc, __dirname);
  await helper.callVersionedPost(runner, args);

  // --------------------------------------------------------
  // Always run this commands (nx version agnostic)
  const context = helper.getContext();
  await runner.execute(
    [
      "rm -rf ./src/app",
      "rm -rf ./favicon.ico",
      "rm -rf ./src/favicon.ico",
      "rm -rf ./src/main.ts",
      "rm -rf ./src/styles.css",
      "rm -rf ./src/environments"
    ],
    {
      cwd: context.getProjectFullPath(),
    }
  );

  // Run this command in the workspace path
  await runner.execute([`npx nx run ${context.getProjectName()}:secrets`], {
    cwd: context.getRootPath(),
  });
};
