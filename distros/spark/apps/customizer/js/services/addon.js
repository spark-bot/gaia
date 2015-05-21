define(["exports"], function (exports) {
  "use strict";

  /* global AddonGenerator */

  var AddonService = {};

  AddonService.getAddons = function (host) {
    return new Promise(function (resolve, reject) {
      var request = navigator.mozApps.mgmt.getAll();
      request.onsuccess = function () {
        var addons = request.result.filter(function (app) {
          var manifest = app.manifest || {};
          if (manifest.role !== "addon") {
            return false;
          }

          if (!host) {
            return true;
          }

          return !!((manifest.customizations || []).find(function (customization) {
            return (customization.filter || "").indexOf(host) !== -1;
          }));
        });

        resolve(addons);
      };
      request.onerror = function () {
        reject(request);
      };
    });
  };

  AddonService.getAddon = function (origin) {
    var _this = this;
    return new Promise(function (resolve, reject) {
      _this.getAddons().then(function (addons) {
        var addon = addons.find(function (addon) {
          return addon.origin === origin;
        });
        if (!addon) {
          reject();
          return;
        }

        resolve(addon);
      })["catch"](reject);
    });
  };

  AddonService.getGenerator = function (target) {
    return new Promise(function (resolve, reject) {
      var name = window.prompt("Enter a name for this add-on", "Addon " + new Date().toISOString());
      if (!name) {
        reject();
        return;
      }

      var generator = new AddonGenerator({
        target: target,
        name: name
      });

      resolve(generator);
    });
  };

  AddonService.generate = function (target, callback) {
    if (typeof callback !== "function") {
      return;
    }

    return AddonService.getGenerator(target).then(function (generator) {
      callback(generator);

      var addonBlob = new Blob([generator.generate()], { type: "application/zip" });
      AddonService.install(addonBlob);
    });
  };

  AddonService.install = function (blob) {
    return new Promise(function (resolve, reject) {
      // Import the addon using the tempfile.
      navigator.mozApps.mgmt["import"](blob).then(function (addon) {
        // Enable the addon by default.
        navigator.mozApps.mgmt.setEnabled(addon, true);
        resolve(addon);
      })["catch"](function (error) {
        console.error("Unable to install the addon", error);
        reject(error);
      });
    });
  };

  AddonService.uninstall = function (origin) {
    var _this2 = this;
    return new Promise(function (resolve, reject) {
      _this2.getAddons().then(function (addons) {
        var addon = addons.find(function (addon) {
          return addon.origin === origin;
        });
        if (!addon) {
          reject();
          return;
        }

        var request = navigator.mozApps.mgmt.uninstall(addon);
        request.onsuccess = function () {
          resolve(request);
        };
        request.onerror = function () {
          reject(request);
        };
      })["catch"](reject);
    });
  };
});