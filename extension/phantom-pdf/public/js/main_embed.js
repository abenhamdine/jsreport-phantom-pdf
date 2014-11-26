define('phantom.template.model',["app", "core/basicModel", "underscore"], function (app, ModelBase, _) {
   
    return ModelBase.extend({
        
        setTemplate: function (templateModel) {
            this.templateModel = templateModel;
            
            if (templateModel.get("phantom") == null) {
                 templateModel.set("phantom", new $entity.Phantom());
            }
            
            this.set(templateModel.get("phantom").initData);

            if (this.get("orientation") == null)
                this.set("orientation", "portrait");

            
            if (this.get("format") == null) {
                this.set("format", "A4");
            }

            this.listenTo(templateModel, "api-overrides", this.apiOverride);
        },
        
        isDirty: function() {
            return this.get("margin") != null || this.get("header") != null || this.get("footer") != null ||
                this.get("width") != null || this.get("height") != null || this.get("orientation") != "portrait" ||
                this.get("format") != "A4";
        },
        
        apiOverride: function(addProperty) {
            addProperty("phantom", {
                    maring: this.get("margin") || "...",
                    header: this.get("header") || "...",
                    footer: this.get("footer") || "...",
                    headerHeight: this.get("headerHeight") || "...",
                    footerHeight: this.get("footerHeight") || "...",
                    format: this.get("format") || "...",
                    orientation: this.get("orientation") || "...",
                    width: this.get("width") || "...",
                    height: this.get("height") || "..."
                });
        },

        initialize: function () {
            var self = this;
            
            this.listenTo(this, "change", function() {
                self.copyAttributesToEntity(self.templateModel.get("phantom"));
            });
        }
    });
});
define(["jquery", "app", "marionette", "backbone", "core/view.base", "phantom.template.model"],
    function ($, app, Marionette, Backbone, ViewBase, Model) {

        var TemplateView = ViewBase.extend({
            template: "embed-phantom-template",

            initialize: function () {
            }
        });


        app.on("extensions-menu-render", function (context) {
            context.result += "<li><a id='phantomMenuCommand' title='define pdf document options' style='display:none'><i data-position='right' data-intro='Define basic pdf settings' class='fa fa-file-pdf-o'></i></a></li>";

            context.on("after-render", function ($el) {
                if (context.template.get("recipe") === "phantom-pdf") {
                    $("#phantomMenuCommand").show();
                }
                else {
                    $("#phantomMenuCommand").hide();
                }

                $("#phantomMenuCommand").click(function () {
                    var model = new Model();
                    model.setTemplate(context.template);

                    var view = new TemplateView({ model: model});
                    context.region.show(view, "phantom");
                });
            });

            context.template.on("change:recipe", function () {
                if (context.template.get("recipe") === "phantom-pdf") {
                    $("#phantomMenuCommand").show();
                }
                else {
                    $("#phantomMenuCommand").hide();
                }
            });
        });

        app.on("entity-registration", function (context) {
            $data.Class.define("$entity.Phantom", $data.Entity, null, {
                'margin': { 'type': 'Edm.String' },
                'header': { 'type': 'Edm.String' },
                'footer': { 'type': 'Edm.String' },
                'headerHeight': { 'type': 'Edm.String' },
                'footerHeight': { 'type': 'Edm.String' },
                'orientation': { 'type': 'Edm.String' },
                'format': { 'type': "string" },
                'width': { 'type': "string" },
                'height': { 'type': "string" }
            }, null);

            $entity.Template.addMember("phantom", { 'type': "$entity.Phantom" });
        });
    });