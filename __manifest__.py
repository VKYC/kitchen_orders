# -*- coding: utf-8 -*-
#################################################################################
#
#################################################################################
{
  "name"                 :  "Ordenes de Cocina",
  "summary"              :  "Crear Ordenes de Cocina.",
  "category"             :  "Point Of Sale",
  "version"              :  "1.0.1",
  "author"               :  "VK&C.",
  "license"              :  "Other proprietary",
  "website"              :  "vkyc11.odoo.com",
  "description"          :  """Modulo para la creacion de ordenes de cocina""",
  "depends"              :  [
                             'point_of_sale',
                             'sale',
                             'mrp',
                             'stock',
                            ],
  "data"                 :  [
                              'views/templates.xml',
                              'views/product_view.xml',
                            ],
  "qweb"                 :  [
                              'static/src/xml/kitchen_order.xml',
                              'static/src/xml/pos_ticket_view.xml',
                            ],
  "images"               :  ['static/description/Banner.png'],
  "application"          :  True,
  "installable"          :  True,
  "auto_install"         :  False,
  "pre_init_hook"        :  "pre_init_check",
}