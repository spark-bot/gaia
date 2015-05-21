define(["exports"], function (exports) {
  "use strict";

  var _extends = function (child, parent) {
    child.prototype = Object.create(parent.prototype, {
      constructor: {
        value: child,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    child.__proto__ = parent;
  };

  var SettingsController = (function (Controller) {
    var SettingsController = function SettingsController(options) {
      Controller.call(this, options);
    };

    _extends(SettingsController, Controller);

    SettingsController.prototype.open = function () {
      var _this = this;
      this.view.modal.open();

      AddonService.getAddons(window.location.host).then(function (addons) {
        _this.view.setAddons(addons);
      });
    };

    SettingsController.prototype.close = function () {
      this.view.modal.close();
    };

    SettingsController.prototype.addons = function () {
      var activity = new window.MozActivity({
        name: "configure",
        data: {
          target: "device",
          section: "addons"
        }
      });

      activity.onerror = function (e) {
        console.error("Error opening Settings Add-ons panel", e);
      };
    };

    SettingsController.prototype.uninstall = function (addon) {
      var _this2 = this;
      AddonService.uninstall(addon.origin).then(function () {
        AddonService.getAddons(window.location.host).then(function (addons) {
          _this2.view.setAddons(addons);
        });
      });
    };

    SettingsController.prototype.enableAddon = function (addon) {
      AddonService.getAddon(addon.origin).then(function (addon) {
        navigator.mozApps.mgmt.setEnabled(addon, true);
      });
    };

    SettingsController.prototype.disableAddon = function (addon) {
      AddonService.getAddon(addon.origin).then(function (addon) {
        navigator.mozApps.mgmt.setEnabled(addon, false);
      });
    };

    return SettingsController;
  })(Controller);

  exports["default"] = SettingsController;
});