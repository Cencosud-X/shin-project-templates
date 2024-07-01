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
      // We need the plugin for kafka and pubsub
      context.whenNotInstalled("@team_seki/subscriber-plugin", (pkg) => {
        return `npm install ${pkg}@latest`;
      }),
      context.whenNotInstalled("@team_seki/kafka-streamer-plugin", (pkg) => {
        return `npm install ${pkg}@latest`;
      }),
      context.whenNotInstalled("@team_seki/pubsub-streamer-plugin", (pkg) => {
        return `npm install ${pkg}@latest`;
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
