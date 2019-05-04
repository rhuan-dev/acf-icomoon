<?php
/*
	Plugin Name: Advanced Custom Fields: ACF IcoMoon
	Plugin URI: https://github.com/rhcarlosweb/acf-icomoon
	Description: Show IcoMoon select field based on selection.json generated from IcoMoon App
	Version: 0.0.1-alpha
	Author: Rhuan Carlos
	Author URI: https://rhuancarlos.com
	License: GPLv2 or later
	License URI: http://www.gnu.org/licenses/gpl-2.0.html
	Text Domain: rhicomoon
*/

# exit accessed directly
if ( !defined( 'ABSPATH' ) ) exit;

if ( !class_exists( 'ACFIcoMoonPlugin' ) ) :
    class ACFIcoMoonPlugin {
        # vars
        var $settings;

        /**
         * ACFIcoMoonPlugin constructor.*
         *
         * @since 0.0.0-alpha
         */
        function __construct() {
            # settings
            # these will be passed into the field class.
            $this->settings = [
                'version' => '0.0.1-alpha',
                'url'     => plugin_dir_url( __FILE__ ),
                'path'    => plugin_dir_path( __FILE__ )
            ];

            # include fields
            add_action( 'acf/include_field_types', [ $this, 'include_field' ] ); // v5 action
            add_action( 'acf/register_fields', [ $this, 'include_field' ] ); // v4 action
        }


        /**
         * include_field
         *
         * @param bool $version (int)major ACF version. Defaults to false
         *
         * @since 0.0.0-alpha
         */
        function include_field( $version = false ) {
            # support empty $version
            if ( !$version ) $version = 4;

            # textdomain
            load_plugin_textdomain( 'rhicomoon', false, plugin_basename( dirname( __FILE__ ) ) . '/lang' );

            # include fields
            include_once( 'fields/acf-field-icomoon-select-v' . $version . '.php' );
        }
    }

    # call class
    new ACFIcoMoonPlugin();
endif;