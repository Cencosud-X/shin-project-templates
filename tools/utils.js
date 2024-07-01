/// <reference path="index.d.ts" />

const path = require("path");
const fs = require("fs");
const PACKAGE_JSON = "package.json";

/**
 * @typedef {Utils} TUtils
 */


let _currentRc;
let _currentTemporalClonedPath;

class Utils {
  constructor(rc, currentTemporalClonedPath) {
    _currentRc = rc;

    // Get up to one folder into full path , to get the cloned base path
    _currentTemporalClonedPath= path.dirname(currentTemporalClonedPath)
  }

  /**
   * Get Configured Settings
   */
  getSettings(){
    return _currentRc.settings;
  }

  /**
   * Return the path where the current archtype folder were 
   * cloned in the current computer via cli clone
   */
  getCurrentClonedPath(){
    return _currentTemporalClonedPath;
  }

  /**
   * Get Run Command Setttings
   * @link https://en.wikipedia.org/wiki/Run_commands
   * @returns {IRc} Run Command Information
   */
  getRc() {
    return _currentRc;
  }

  /**
   * Get Nx workspace information
   * @returns {INxInformation} Nx information
   */
  getNxInformation = () => {
    const packageJsonPath = path.join(_currentRc.workspace_path, PACKAGE_JSON);
    const packageDevDependencies = require(packageJsonPath).devDependencies;

    let nxWorkspace = "@nrwl/workspace";
    if (!packageDevDependencies[nxWorkspace]) {
      nxWorkspace = "@nx/workspace";
    }

    // Check if Nx is older than 15 or new
    // (we know that checking if the workspace start with @nrwl or @nx)
    const nxVersion = packageDevDependencies[nxWorkspace];
    const nxPrefix = nxWorkspace.substring(0, nxWorkspace.indexOf("/"));

    const splitVersion = nxVersion.split(".");

    return {
      version: nxVersion,
      workspace: nxWorkspace,
      prefix: nxPrefix,
      semver: {
        major: parseInt(splitVersion[0].replace("^", "")),
        minor: parseInt(splitVersion[1]),
        patch: parseInt(splitVersion[2]),
      },
    };
  };

  /**
   * Retrieve a boolean that indicates if the package are installed in the
   * current project
   * @param {string} packageName package name to verify
   * @returns
   */
  hasPackageInstalled = (packageName) => {
    return this.getPackageInformation(packageName) !== null;
  };

  /**
   * Get the package information
   * @param {string} packageName Package name
   * @returns {IPackageInformation} Package information (can be null)
   */
  getPackageInformation = (packageName) => {
    if (packageName.lastIndexOf("@") >= 1) {
      packageName = packageName.substring(0, packageName.lastIndexOf("@"));
    }

    const packageJsonPath = path.join(_currentRc.workspace_path, PACKAGE_JSON);
    const pkgDevDeps = require(packageJsonPath).devDependencies;
    const pkgDeps = require(packageJsonPath).dependencies;
    const packageLine = pkgDevDeps[packageName] || pkgDeps[packageName];

    if (!packageLine) {
      return null;
    }

    const splitVersion = packageLine.split(".");

    return {
      name: packageName,
      version: packageLine,
      semver: {
        major: parseInt(splitVersion[0].replace("^", "")),
        minor: parseInt(splitVersion[1]),
        patch: parseInt(splitVersion[2]),
      },
    };
  };

  /**
   * Return the script variable if the package wasnt not
   * installed in dependencies or devDependencies
   * @param {string} packageName Package name to verify
   * @param {(packageName:string)=>string} script Script to return if package wasn`t not installed
   * @returns {string|null} script or null if not installed
   */
  whenNotInstalled = (packageName, script) => {
    if (!this.hasPackageInstalled(packageName)) {
      return script(packageName);
    }

    const pkgInfo = this.getPackageInformation(packageName);

    // Ok, the package exists!, but we need to validate the
    // version if the dev try to check too
    if (packageName.lastIndexOf("@") >= 1) {
      const indexOf = packageName.lastIndexOf("@");
      const pkgVersion = packageName.substring(indexOf + 1);

      if (pkgInfo.version.indexOf(pkgVersion) >= 0) {
        return null;
      }
    }

    return script(packageName);
  };

  /**
   * Get Project Name
   * @returns {string} Project name
   */
  getProjectName = () => {
    return _currentRc.path;
  };

  /**
   * Get Project Full Name (product path + project folder)
   * @returns {string} Project Full Path
   */
  getProjectFullPath = () => {
    return path.join(
      this.getRootPath(),
      this.getRc().group_folder,
      this.getProjectName()
    );
  };

  /**
   * Check if the project in the rc was created
   * @returns {boolean} Project created or not
   */
  projectWasCreated = () => {
    return fs.existsSync(this.getProjectFullPath());
  };

  /**
   * Check if the project exists in workspace
   * @returns {boolean} Project created or not
   */
  hasProjectInWorkspace = (projectName) => {
    const projectFullPath = path.join(
      this.getRootPath(),
      this.getRc().group_folder,
      projectName
    );

    return fs.existsSync(projectFullPath);
  };

  /**
   * Get Product Root Path
   * @returns {string} Repository root path
   */
  getRootPath() {
    return _currentRc.workspace_path;
  }
}

module.exports = {
  Utils: Utils,
  fromRc(rc, currentTemporalClonedPath) {
    return new Utils(rc, currentTemporalClonedPath);
  },
};
