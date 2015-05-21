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

  /* global View */

  var settingsViewTemplate = "<gaia-modal class=\"settings\">\n  <gaia-header>\n    <button data-action=\"close\">Close</button>\n    <h1>Settings</h1>\n    <button data-action=\"addons\">All Add-ons</button>\n  </gaia-header>\n  <section>\n    <gaia-sub-header>Installed Add-ons</gaia-sub-header>\n    <gaia-list></gaia-list>\n  </section>\n</gaia-modal>";

  var SettingsView = (function (View) {
    var SettingsView = function SettingsView(options) {
      View.call(this, options);

      this.el.className = "fxos-customizer-settings-view";

      this.render();
    };

    _extends(SettingsView, View);

    SettingsView.prototype.init = function (controller) {
      View.prototype.init.call(this, controller);

      this.modal = this.$("gaia-modal");
      this.addons = this.$("gaia-list");

      this.on("click", "gaia-button", this._handleClick.bind(this));
      this.on("click", "button", this._handleClick.bind(this));

      // this.on('change', 'gaia-switch', this._handleChange.bind(this));
    };

    SettingsView.prototype.template = function () {
      return settingsViewTemplate;
    };

    SettingsView.prototype.setAddons = function (addons) {
      var _this = this;
      this.addons.innerHTML = "";

      addons.forEach(function (addon) {
        var installTime = new Date(addon.installTime);
        _this.addons.innerHTML += "<li flexbox>\n  <span flex>\n    <gaia-switch data-origin=\"" + addon.origin + "\" data-enabled=\"" + addon.enabled + "\"></gaia-switch>\n  </span>\n  <span flex>\n    " + addon.manifest.name + "\n    <span class=\"addon-time\">\n      " + installTime.toLocaleDateString() + "\n      " + installTime.toLocaleTimeString() + "\n    </span>\n  </span>\n  <span flex>\n    <gaia-button circular data-action=\"uninstall\" data-origin=\"" + addon.origin + "\">\n      <i data-icon=\"delete\"></i>\n    </gaia-button>\n  </span>\n</li>";
      });

      [].forEach.call(this.addons.querySelectorAll("gaia-switch"), function (gs) {
        if (gs.dataset.enabled === "true") {
          gs.setAttribute("checked", true);
        }

        delete gs.dataset.enabled;
      });

      // XXX - Shouldn't have to do this, but 'change' is not propagating
      [].forEach.call(document.querySelectorAll("gaia-switch"), function (gs) {
        gs.addEventListener("change", _this._handleChange.bind(_this));
      });
    };

    SettingsView.prototype._handleClick = function (evt) {
      var action = this.controller[evt.target.dataset.action];
      if (typeof action === "function") {
        action.call(this.controller, evt.target.dataset);
      }
    };

    SettingsView.prototype._handleChange = function (evt) {
      var gaiaSwitch = evt.target;
      if (gaiaSwitch.checked) {
        this.controller.enableAddon(gaiaSwitch.dataset);
      } else {
        this.controller.disableAddon(gaiaSwitch.dataset);
      }
    };

    return SettingsView;
  })(View);

  exports["default"] = SettingsView;
});