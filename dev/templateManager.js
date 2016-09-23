/* =============== TemplateManager Class =============== */

/**
 * Class to manage the loading of templates from external files using lodash.js simple templating capabilities and JQuery.
 */
class TemplateManager {

  /**
   * Constructor function for the templateManager
   * @param  {object} viewPaths          list of template URLs. Object keys will be used as the template name. 
   * {templateName1: templateUrl1, templateName2: templateUrl2, ...}
   * @param  {function} callbackWhenLoaded Callback function to call when templates are loaded.
   * @public
   */
  constructor(viewPaths = mandatory(), callbackWhenLoaded = null) {

    /* Allow double curly bracket syntax in the template html: {{variable}} */
    _.templateSettings.interpolate = /\{\{(.+?)\}\}/g;

    /**
     * Contains all templates urls: {name: url}. 
     * New templates can be added by adding keys to that object after the templateManager is instanciated: templateManager.viewPaths.newTemplate = url;
     * @type {object}
     */
    this.viewPaths = viewPaths;

    /**
     * Contains cached template in underscore template format
     * @type {Object}
     */
    this.cached = {};

    /** setup callback when all templates are loaded */
    if (callbackWhenLoaded) {
      this.callbackWhenLoaded = callbackWhenLoaded;
    } else {
      this.callbackWhenLoaded = function () {
        console.log("TemplateManager.js: all templates loaded.");
      };
    }

    /* Keeps reference to the current object */
    var thisObject = this;

    /* Caches every templates asynchronously */
    _.each(this.viewPaths, function (value, key, list) {
      $.get(thisObject.viewPaths[key], function (raw) {

        /** store after loading */
        thisObject.store(key, raw);

        /** checks if all template are loaded */
        if (_.every(_.keys(thisObject.viewPaths), function (key) {
            return (_.has(thisObject.cached, key));
          })) {
          /** All templates loaded, call the supplied callback. */
          thisObject.callbackWhenLoaded();
        }

      });
    });

  }

  /**
   * Render the HTML of a template based on its name.
   * @param  {string} name      template name
   * @param  {Object} variables Object holding the variable values to replace in the template before rendering.
   */
  render(name, variables = {}) {
    var thisObject = this;
    if (this.isCached(name)) {
      return (this.cached[name](variables));
    } else {
      $.get(this.urlFor(name), function (raw) {
        thisObject.store(name, raw);
        thisObject.render(name, variables);
      });
    }
  }

  /**
   * Render the HTML of a template based on its name into a DOM target.
   * @param  {string} name      template name
   * @param  {Object} variables Object holding the variable values to replace in the template before rendering.
   * @param  {Object} target    DOM element to render the HTML into
   */
  renderInTarget(name, variables, target) {
    var thisObject = this;
    if (this.isCached(name)) {
      $(target).append(this.cached[name](variables));
    } else {
      $.get(this.urlFor(name), function (raw) {
        thisObject.store(name, raw);
        thisObject.renderInTarget(name, variables, target);
      });
    }

  }

  /**
   * Synchronous fetching and rendering using ajax synchronous file fetching.
   * @param  {string}   name     template name
   */
  renderSync(name) {
    if (!this.isCached(name)) {
      this.fetch(name);
    }
    this.render(name);
  }

  /**
   * Preloads and cache the template as underscore templates.
   * @param  {string} name template name
   */
  prefetch(name) {
    var thisObject = this;
    $.get(this.urlFor(name), function (raw) {
      thisObject.store(name, raw);
    });
  }

  /**
   * Synchronously fetch a template.
   * @param  {string} name template name 
   */
  fetch(name) {
    // synchronous, for those times when you need it.
    if (!this.isCached(name)) {
      var raw = $.ajax({
        'url': this.urlFor(name),
        'async': false
      }).responseText;
      this.store(name, raw);
    }
  }

  /**
   * Checks if a specified template is already cached
   * @param  {string}  name template name
   * @return {Boolean}      
   */
  isCached(name) {
    return !!this.cached[name];
  }

  /**
   * Stores a template from raw html as a underscore template.
   * @param  {string} name template name
   * @param  {string} raw  template html 
   */
  store(name, raw) {
    this.cached[name] = _.template(raw);
  }

  /**
   * Return the path of the specified template
   * @param  {string} name template name
   * @return {string}      template url
   */
  urlFor(name) {
    return (this.viewPaths[name]);
  }
}

/* =============== Utility Functions =============== */

/**
 * Called when mandatory argument is not set
 * @param  {String} param Optional name of the missing argument
 */

function mandatory(param = "") {

  throw new Error('Missing parameter ' + param);
}