const { witHelper } = require("./../../tools/helper");
/**
 * @type {import("../../tools").TRawMethod}
 */
module.exports = async (runner, args) => {
  // Call script based on the Nx Version!
  const helper = witHelper(args.rc, __dirname);
  await helper.callVersionedPre(runner, args);
};
