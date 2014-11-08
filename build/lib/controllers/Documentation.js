// Generated by LiveScript 1.2.0
(function(){
  var Q, templating, jade, path, DocumentationController;
  Q = require('q');
  templating = require('url-template');
  jade = require('jade');
  path = require('path');
  DocumentationController = (function(){
    DocumentationController.displayName = 'DocumentationController';
    var prototype = DocumentationController.prototype, constructor = DocumentationController;
    function DocumentationController(registry, apiInfo, templatePath){
      var data, childTypesToParentTypesMap, i$, ref$, len$, type, adapter, inflector, modelName, model, children, j$, len1$, childType, info;
      this.registry = registry;
      this.apiInfo = apiInfo;
      this.template = templatePath || path.resolve(__dirname, '../../../templates/documentation.jade');
      data = this.apiInfo;
      data.resourcesMap = {};
      childTypesToParentTypesMap = {};
      for (i$ = 0, len$ = (ref$ = this.registry.types()).length; i$ < len$; ++i$) {
        type = ref$[i$];
        adapter = this.registry.adapter(type);
        inflector = adapter.inflector;
        modelName = adapter.constructor.getModelName(type, inflector.singular);
        model = adapter.getModel(modelName);
        children = adapter.constructor.getChildTypes(model, inflector.plural);
        data.resourcesMap[type] = this.getModelInfo(type, adapter, modelName, model);
        if (children) {
          for (j$ = 0, len1$ = children.length; j$ < len1$; ++j$) {
            childType = children[j$];
            childTypesToParentTypesMap[childType] = type;
          }
        }
      }
      for (type in ref$ = data.resourcesMap) {
        info = ref$[type];
        info.parentType = childTypesToParentTypesMap[type];
      }
      this.templateData = data;
    }
    prototype.index = function(req, res){
      return res.send(jade.renderFile(this.template, this.templateData));
    };
    prototype.getModelInfo = function(type, adapter, modelName, model){
      var info, fieldsInfo, path, fieldInfo, ref$, x$;
      info = this.registry.info(type);
      fieldsInfo = adapter.constructor.getStandardizedSchema(model);
      for (path in fieldsInfo) {
        fieldInfo = fieldsInfo[path];
        if ((info != null ? (ref$ = info.fields) != null ? ref$[path] : void 8 : void 8) != null) {
          fieldInfo.description = info.fields[path];
        }
      }
      x$ = {};
      x$['name'] = modelName;
      if ((info != null ? info.example : void 8) != null) {
        x$['example'] = info.example;
      }
      if ((info != null ? info.defaultIncludes : void 8) != null) {
        x$['defaultIncludes'] = info.defaultIncludes;
      }
      if ((info != null ? info.description : void 8) != null) {
        x$['description'] = info.description;
      }
      x$['schema'] = fieldsInfo;
      return x$;
    };
    return DocumentationController;
  }());
  module.exports = DocumentationController;
}).call(this);