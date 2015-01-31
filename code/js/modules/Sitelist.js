;(function() {
  "use strict";

  var $ = require("jquery");

  /**
   * @return {RegExp} a regex that matches where the string is in a url's (domain) name
   */
  var URL_check = function(domain, alias) {
    var inner = alias ? domain + "|www." + domain + "|" + alias.join("|") : domain + "|www." + domain;
    return (new RegExp("^(http|https):\/\/(?:[^.]*\\.){0,3}(?:" + inner + ")+\\."));
  };

  /**
   * Base class for all sites enabled in extension
   */
  var Sitelist = function() { return this; };

  Sitelist.prototype.init = function() {
    this.sites = {
      "7digital": {name: "7digital", url: "http://www.7digital.com", enabled: true},
      "8tracks": {name: "8tracks", url: "http://www.8tracks.com", enabled: true},
      "amazon": {name: "Amazon Cloud Player", url: "https://www.amazon.com/gp/dmusic/cloudplayer/player",
          enabled: true},
      "ambientsleepingpill": {name: "Ambient Sleeping Pill", url: "http://www.ambientsleepingpill.com",
          enabled: true},
      "bandcamp": {name: "Bandcamp", url: "http://www.bandcamp.com", enabled: true},
      "beatsmusic": {name: "Beats Web Player", url: "https://listen.beatsmusic.com/", enabled: true},
      "bop": {name: "Bop.fm", url: "http://www.bop.fm", enabled: true},
      "cubic": {name: "Cubic.fm", url: "http://www.cubic.fm", enabled: true},
      "deezer": {name: "Deezer", url: "http://www.deezer.com", enabled: true},
      "di": {name: "Di.fm", url: "http://www.di.fm", enabled: true},
      "disco": {name: "Disco.io", url: "http://www.disco.io", enabled: true},
      "earbits": {name: "Earbits", url: "http://www.earbits.com", enabled: true},
      "player.edge": {name: "Edge Player", url: "http://player.edge.ca", controller: "EdgeController.js",
          enabled: true},
      "grooveshark": {name: "Grooveshark", url: "http://www.grooveshark.com", enabled: true},
      "hypem": {name: "Hypemachine", url: "http://www.hypem.com", enabled: true},
      "iheart": {name: "iHeartRadio", url: "http://www.iheart.com", enabled: true},
      "jango": {name: "Jango", url: "http://www.jango.com", enabled: true},
      "last": {name: "LastFm", url: "http://www.last.fm", controller: "LastfmController.js", enabled: true,
          alias: ["lastfm"]},
      "laracasts": {name: "Laracasts", url: "http://www.laracasts.com", enabled: true},
      "mixcloud": {name: "Mixcloud", url: "http://www.mixcloud.com", enabled: true},
      "music.sonyentertainmentnetwork": {name: "SonyMusicUnlimited", url: "https://music.sonyentertainmentnetwork.com",
          controller: "SonyMusicUnlimitedController.js", enabled: true},
      "myspace": {name: "MySpace", url: "http://www.myspace.com", enabled: true},
      "npr": {name: "NPR One Player", url: "http://one.npr.org", enabled: true},
      "oplayer": {name: "oPlayer", url: "http://oplayer.org", enabled: true},
      "palcomp3": {name: "Palco MP3", url: "http://palcomp3.com", enabled: true},
      "pandora": {name: "Pandora", url: "http://www.pandora.com", enabled: true},
      "pleer": {name: "Pleer.com", url: "http://pleer.com", enabled: true},
      "plex": {name: "Plex", url: "http://www.plex.tv", enabled: true},
      "pocketcasts": {name: "Pocketcasts", url: "https://play.pocketcasts.com", enabled: true},
      "play.google": {name: "Google Music", url: "http://play.google.com", controller: "GoogleMusicController.js",
          enabled: true},
      "radioswissjazz": {name: "RadioSwissJazz", url: "http://www.radioswissjazz.ch", enabled: true},
      "rainwave": {name: "Rainwave.cc", url: "http://www.rainwave.cc", enabled: true},
      "radioparadise": {name: "RadioParadise", url: "http://www.radioparadise.com", enabled: true},
      "rdio": {name: "Rdio", url: "http://www.rdio.com", enabled: true},
      "seesu": {name: "Seesu.me", url: "http://www.seesu.me", enabled: true},
      "slacker": {name: "Slacker", url: "http://www.slacker.com", enabled: true},
      "songstr": {name: "Songstr", url: "http://www.songstr.com", enabled: true},
      "songza": {name: "Songza", url: "http://www.songza.com", enabled: true},
      "soundcloud": {name: "Soundcloud", url: "http://www.soundcloud.com", enabled: true},
      "spotify": {name: "Spotify Web Player", url: "http://www.spotify.com", enabled: true},
      "stitcher": {name: "Stitcher", url: "http://www.stitcher.com", enabled: true},
      "tunein": {name: "TuneIn", url: "http://www.tunein.com", enabled: true},
      "thesixtyone": {name: "TheSixtyOne", url: "http://www.thesixtyone.com", enabled: true},
      "vk": {name: "Vkontakte", url: "http://www.vk.com", enabled: true},
      "music.yandex": {name: "Yandex", url: "http://music.yandex.ru", enabled: true},
      "youarelistening": {name: "YouAreListening.to", url: "http://www.youarelistening.to",
          controller: "YouarelisteningtoController.js", enabled: true},
      "youtube": {name: "YouTube", url: "http://www.youtube.com", enabled: true},
      "saavn": {name: "Saavn", url: "http://www.saavn.com", enabled: true},
      "gaana": {name: "Saavn", url: "http://www.gaana.com", enabled: true},
      "xbox": {name: "Xbox Music", url: "http://music.xbox.com", enabled: true},
      "hypster": {name: "Hypster", url: "http://www.hypster.com", enabled: true}
    };
    this.disabledTabs = [];
  };

  /**
   * Get site enabled settings from localstorage
   */
  Sitelist.prototype.loadSettings = function() {
    var that = this;
    if(!this.sites) this.init();
    console.log(this);
    chrome.storage.local.get(function(obj) {
      var objSet = obj.hasOwnProperty("hotkey-sites"),
          storageObj = {};
      $.each(that.sites, function(key) {
        if(objSet && (typeof obj["hotkey-sites"][key] !== "undefined")) that.sites[key].enabled = obj["hotkey-sites"][key];
        that.sites[key].url_regex = new URL_check(key, that.sites[key].alias);
        storageObj[key] = that.sites[key].enabled;
      });
      // Set the storage key on init incase previous storage format becomes broken
      chrome.storage.local.set({"hotkey-sites": storageObj});
    });
  };

  /**
   * Set site enabled settings in localstorage
   * @param key {String} name of the hotkey-sites key in localstorage
   * @param value {Object} value to set
   * @return {Promise}
   */
  Sitelist.prototype.setStorage = function(key, value) {
    var promise = new Promise(function(resolve, reject) {
      chrome.storage.local.get(function(obj) {
        if(obj["hotkey-sites"]) {
          obj["hotkey-sites"][key] = value;
          chrome.storage.local.set({"hotkey-sites": obj["hotkey-sites"]}, function() {
            resolve(true);
          });
        } else {
          reject("Storage object not found.");
        }
      });
    });

    return promise;
  };

  // @return [arr] enabled sites
  Sitelist.prototype.getEnabled = function() {
    return $.map(this.sites, function(val, key) {
      if(val.enabled) return key;
    });
  };

  /**
   * Returns the sitelist key of a url if it is matched to a music site
   * @param url {String} url to check
   * @return {String} sitelist key if found, null otherwise
   */
  Sitelist.prototype.getSitelistName = function(url) {
    var filtered_sites = $.grep(Object.keys(window.sk_sites.sites), function (name) {
      return window.sk_sites.sites[name].url_regex.test(url);
    });

    if (!filtered_sites.length) return null;

    return filtered_sites[0];
  };

  /**
   * Gets all of the tabId's of a music site
   * @return {Promise}
   */
  Sitelist.prototype.getMusicTabsByUrl = function(url) {
    var sitelist_name = this.getSitelistName(url),
        that = this;

    var promise = new Promise(function(resolve, reject) {
      if(sitelist_name === null) reject([]);

      var tab_ids = [];
      var url_regex = that.sites[sitelist_name].url_regex;
      chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
          if(url_regex.test(tab.url)) tab_ids.push(tab.id);
        }, this);
        resolve(tab_ids);
      });
    });

    return promise;
  };

  /**
   * @param url {String} url of site to check for
   * @return {Boolean} true if url matches an enabled site
   */
  Sitelist.prototype.checkEnabled = function(url) {
    var _sites = this.sites;

    return this.getEnabled().some(function(sitename) {
      return (_sites[sitename].url_regex.test(url));
    });
  };

  /**
   * @param url {String} url of site to check for
   * @return {Boolean} true if url matches a music site
   */
  Sitelist.prototype.checkMusicSite = function(url) {
    var sites_regex = $.map(this.sites, function(el) { return el.url_regex; });

    return sites_regex.some(function(url_regex) {
      return (url_regex.test(url));
    });
  };

  Sitelist.prototype.setSiteTabIcons = function(url) {
    this.getMusicTabsByUrl(url).then(function(tab_ids) {
      tab_ids.forEach(function(tab_id) {
        chrome.runtime.sendMessage({action: "set_icon", url: url, tab_id: tab_id});
      });
    }, function(err) {
      console.log(err);
    });
  };

  /**
   * Set the disabled value of a music site and store results in localstorage
   * @param url {String} url of site to mark as disabled
   * @param is_disabled {Boolean} disable site if true, enable site if false
   */
  Sitelist.prototype.markSiteAsDisabled = function(url, is_disabled) {
    var site_name = this.getSitelistName(url),
        value = !is_disabled,
        that = this;
    if(site_name) {
      this.sites[site_name].enabled = value;
      this.setStorage(site_name, value).then(function() {
        that.setSiteTabIcons(url);
      }, function(err) {
        console.log(err);
      });
    }
  };

  /**
   * Checks if a tab has been temp disabled
   * @param tabId {Number} id of tab to check
   * @return {Boolean} true if tab is enabled
   */
  Sitelist.prototype.checkTabEnabled = function(tabId) {
    return (tabId && this.disabledTabs.indexOf(tabId) === -1);
  };

  /**
   * @param tabId {Number} id of tab to temp disable
   * @param is_disabled {Boolean} disable tab if true, enable tab if false
   */
  Sitelist.prototype.markTabAsDisabled = function(tabId, is_disabled) {
    if(is_disabled)
      this.disabledTabs.push(tabId);
    else
      this.disabledTabs = this.disabledTabs.filter(function(el) { return el !== tabId; });
  };

  /**
   * Gets the filename of a sites controller
   * @param url {String} URL to get controller for
   * @return {String} controller filename if found
   */
  Sitelist.prototype.getController = function(url) {
    var site_name = this.getSitelistName(url);
    if(site_name) {
      var site = window.sk_sites.sites[site_name];
      if(site.controller) return site.controller;

      return (site_name[0].toUpperCase() + site_name.slice(1) + "Controller.js");
    }

    return null;
  };

  /**
   * Gets an array of all active and enabled music tabs
   * @return {Promise}
   */
  Sitelist.prototype.getActiveMusicTabs = function() {
    var that = this;
    var promise = new Promise(function(resolve) {
      var music_tabs = [];
      chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
          if(that.checkEnabled(tab.url) && that.checkTabEnabled(tab.id)) music_tabs.push(tab);
        });

        resolve(music_tabs);
      });
    });

    return promise;
  };

  /**
   * When Sitelist is required create a new singleton and return that
   * Note: This makes all methods/properties of Sitelist publicly exposed
   */
  module.exports = new Sitelist();
})();
