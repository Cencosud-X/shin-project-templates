/// <reference path="index.d.ts" />

const { existsSync } = require("fs");
const { join } = require("path");
const fromRc = require("./utils").fromRc;

/**
 * @type {import("./utils").TUtils}
 */
let utils;

class Helper {
  constructor(rc, currentTemporalClonedPath) {
    utils = fromRc(rc, currentTemporalClonedPath);
  }

  /**
   * Get context
   * @returns context
   */
  getContext() {
    return utils;
  }

  getVersionedPath() {
    const clonedPath = this.getContext().getCurrentClonedPath();

    const { version, semver, workspace } = utils.getNxInformation();

    const nxDefaults = {
      14: 14,
      15: 14,
      16: 16,
    };

    let nxFolder = 16;
    if (nxDefaults[semver.major]) {
      nxFolder = nxDefaults[semver.major];
    }

    // If the folder exist then set the folder scripts to
    // that specific version!
    if (existsSync(join(clonedPath, 'scripts', `nx${semver.major}`))) {
      nxFolder = semver.major;
    }

    console.info("");
    console.info("Nx Information:");
    console.info(` Version:   ${version}`);
    console.info(` Workspace: ${workspace}`);
    console.info("");

    return join(clonedPath, 'scripts', `nx${nxFolder}`)
  }

  async callVersionedPre(runner, args) {
    const folderPath = this.getVersionedPath();
    const scriptPath = join(folderPath, "pre.js");

    // Call versioned script and execute
    const script = require(scriptPath);
    await script(runner, utils, args);
  }

  async callVersionedPost(runner, args) {
    const folderPath = this.getVersionedPath();
    const scriptPath = join(folderPath, "post.js");

    // Call versioned script and execute
    const script = require(scriptPath);
    await script(runner, utils, args);
  }

  async callVersionedRollback(runner, args) {
    const folderPath = this.getVersionedPath();
    const scriptPath = join(folderPath, "rollback.js");

    // Call versioned script and execute
    const script = require(scriptPath);
    await script(runner, utils, args);
  }
}

module.exports = {
  witHelper(rc, currentTemporalClonedPath) {
    return new Helper(rc, currentTemporalClonedPath);
  },
};
