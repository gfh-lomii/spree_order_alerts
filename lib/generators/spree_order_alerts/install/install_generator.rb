module SpreeOrderAlerts
  module Generators
    class InstallGenerator < Rails::Generators::Base

      def add_javascripts
        append_file 'vendor/assets/javascripts/spree/backend/all.js', "//= require spree/backend/spree_order_alerts\n"
      end

      def add_stylesheets
        append_file 'vendor/assets/stylesheets/spree/backend/all.css', "//= require spree/backend/spree_order_alerts\n"
      end

    end
  end
end
