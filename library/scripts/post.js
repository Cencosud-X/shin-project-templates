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
  await runner.execute([
    'rm -rf ./src/lib'
  ],{
    cwd: context.getProjectFullPath(),
  });
};
