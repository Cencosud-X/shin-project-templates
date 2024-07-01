const { witHelper } = require("./../../tools/helper");
/**
 * @type {import("../../tools").TRawMethod}
 */
module.exports = async (runner, args) => {
  // Call script based on the Nx Version!
  const helper = witHelper(args.rc, __dirname);
  await helper.callVersionedRollback(runner, args);

  // --------------------------------------------------------
  // Always run this commands (nx version agnostic)
  const context = helper.getContext();
  const { prefix } = context.getNxInformation();

  // If the project was created, try to remove
  if (context.projectWasCreated()) {
    await runner.execute(
      [
        "npx nx reset",
        "sleep 2",
        `npx nx g ${prefix}/workspace:rm ${context.getProjectName()} --forceRemove`,
      ],
      {
        cwd: context.getRootPath(),
      }
    );
  }
};
