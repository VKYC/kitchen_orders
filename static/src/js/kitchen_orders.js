
odoo.define('kitchen_orders.kitchen_orders', function(require) {
    "use strict";
	var rpc = require('web.rpc');
    var screens = require('point_of_sale.screens');
    var core = require('web.core');
    var ActionManager1 = require('web.ActionManager');
    var PopupWidget = require("point_of_sale.popups");
    var gui = require('point_of_sale.gui');
    var _t = core._t;
/////////////////////////////////////////////////////////////////////////
    var models = require('point_of_sale.models');
    
////////////////////////////////////////////////////////////////////////

    var CustomInfoPopup = PopupWidget.extend({
        template: 'CustomInfoPopup',
    });
    gui.define_popup({ 
        name: 'kitchen_order_custom_message', 
        widget: CustomInfoPopup 
    });


//////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
//                                                                                              //
//    kitchen                                                                                   //
//                                                                                              //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////

var CreateKitchenOrderWidget = screens.ActionButtonWidget.extend({
    template: 'CreateKitchenOrderWidget',

    button_click: function() {
        ////////////////////////////////////////////////////////
        // models.load_fields("product.template", "to_make_mrp");
        // models.PosModel = models.PosModel.extend({
        //     getOnlinePaymentJournals: function () {
        //         var self = this;
        //         console.log(val.to_make_mrp);
        //     }
        // });    
        /////////////////////////////////////////////////////////
        var self = this;
        var order = self.pos.get('selectedOrder');
        var client = order.get_client();
        var orderdataa = order.export_as_JSON();
        // var orderLine = order.orderlines;
        var user = self.pos.cashier || self.pos.user;
        var list_product = [];

////////////////////////////////////////////////////////////////////////
        // for(var i=0; i<order.orderlines.length; i++){
        //     var model=models[i];
        //     if(model.model === 'product.product'){
        //         model.fields.push('to_make_mrp');
        //     }
        // }
////////////////////////////////////////////////////////////////////////

        if (order.orderlines.length == 0) {
            self.pos.gui.show_popup('kitchen_order_custom_message', {
                'title': _t("Seleccione un producto"),
                'body': _t("Debe Seleccioner al menos un producto."),
            });
        } else if (client == null) {
            self.gui.show_popup('confirm', {
                'title': _t('Por Favor Seleccione un cliente'),
                'body': _t('Usted necesita seleccionar primero un cliente.'),
                confirm: function() {
                    self.gui.show_screen('clientlist');
                },
            });
        } else {
            for (var i in order.orderlines.models)
                {
                    // console.log();
                    // self.is_to_make_mrp([String(order.orderlines.models[i].product.product_tmpl_id)]);
                    // if (order.orderlines.models[i].product.to_make_mrp)
                    // {
                        if (order.orderlines.models[i].quantity>0)
                        {
                            var product_dict = {
                                'id': order.orderlines.models[i].product.id,
                                'qty': order.orderlines.models[i].quantity,
                                'product_tmpl_id': order.orderlines.models[i].product.product_tmpl_id,
                                'pos_reference': order.name,
                                'uom_id': order.orderlines.models[i].product.uom_id[0],
                            };           
                        list_product.push(product_dict);
                        }
                    // }
                }
                if (list_product.length)
                {
                    self.create_kitchen_order_rpc([1, list_product]);

                }
        }
        },is_to_make_mrp: function(values) {
            var self = this;
                rpc.query({
                model: 'product.product',
                method: 'is_to_make_mrp',
                args: values,
            })
            .fail(function(unused, event) {
                console.log("fail");
            })
            .done(function(result) {
                console.log(result);
            });
            },create_kitchen_order_rpc: function(values){
            var self = this;
                rpc.query({
                model: 'mrp.production',
                method: 'create_mrp_from_pos',
                args: values,
            })
            .fail(function(unused, event) {
                self.gui.show_popup('error', {
                    'title': _t("Error!!!"),
                    'body': _t("Chequee que este conectado correctamente."),
                });
            })
            .done(function(result) {
                self.gui.show_popup('kitchen_order_custom_message', {
                    'title': _t("Pedido Añadido"),
                    'body': _t("Su pedido ha sido añadido"),
                });
            });
        }
});
screens.define_action_button({
    'name': 'KitchenOrder',
    'widget': CreateKitchenOrderWidget,
    'condition': function() {
        return true;
    },
});
});
