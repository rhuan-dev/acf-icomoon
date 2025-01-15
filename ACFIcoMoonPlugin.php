<?php
/**
 * Plugin Name: Advanced Custom Fields: IcoMoon
 * Plugin URI: https://github.com/rhcarlosweb/acf-icomoon
 * Description: Show IcoMoon select field based on selection.json generated from IcoMoon App
 * Version: 0.0.1-alpha
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * Author: Rhuan Carlos
 * Author URI: https://rhuan.dev
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: rhicomoon
 * Domain Path: /lang
 *
 * @package ACF_IcoMoon
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

if (!class_exists('ACFIcoMoonPlugin')):

    class ACFIcoMoonPlugin
    {
        /**
         * Plugin version.
         *
         * @var string
         */
        const VERSION = '0.0.1-alpha';

        /**
         * Plugin instance.
         *
         * @var ACFIcoMoonPlugin|null
         */
        private static $instance = null;

        /**
         * Plugin settings.
         *
         * @var array
         */
        private $settings;

        /**
         * Get plugin instance.
         *
         * @return ACFIcoMoonPlugin
         */
        public static function instance()
        {
            if (null === self::$instance) {
                self::$instance = new self();
            }
            return self::$instance;
        }

        /**
         * Constructor.
         */
        private function __construct()
        {
            $this->define_constants();
            $this->init_settings();
            $this->init_hooks();
        }

        /**
         * Define plugin constants.
         */
        private function define_constants()
        {
            define('ACF_ICOMOON_VERSION', self::VERSION);
            define('ACF_ICOMOON_FILE', __FILE__);
            define('ACF_ICOMOON_PATH', plugin_dir_path(__FILE__));
            define('ACF_ICOMOON_URL', plugin_dir_url(__FILE__));
        }

        /**
         * Initialize settings.
         */
        private function init_settings()
        {
            $this->settings = [
                'version' => self::VERSION,
                'url' => ACF_ICOMOON_URL,
                'path' => ACF_ICOMOON_PATH
            ];
        }

        /**
         * Initialize hooks.
         */
        private function init_hooks()
        {
            // Check if ACF is active
            add_action('plugins_loaded', [$this, 'check_acf']);

            // Load plugin textdomain
            add_action('init', [$this, 'load_textdomain']);

            // Include field
            add_action('acf/include_field_types', [$this, 'include_field']);
            add_action('acf/register_fields', [$this, 'include_field']); // ACF4
        }

        /**
         * Check if ACF is active.
         */
        public function check_acf()
        {
            if (!class_exists('ACF')) {
                add_action('admin_notices', function () {
                    ?>
                    <div class="notice notice-error">
                        <p><?php _e('ACF IcoMoon requires Advanced Custom Fields to be installed and activated.', 'rhicomoon'); ?></p>
                    </div>
                    <?php
                });
                return;
            }
        }

        /**
         * Load plugin textdomain.
         */
        public function load_textdomain()
        {
            load_plugin_textdomain('rhicomoon', false, dirname(plugin_basename(__FILE__)) . '/lang');
        }

        /**
         * Include field.
         *
         * @param int|bool $version Major ACF version. Defaults to false.
         */
        public function include_field($version = false)
        {
            if (!$version) {
                $version = 5;
            }

            include_once sprintf('%sfields/acf-field-icomoon-select-v%d.php', ACF_ICOMOON_PATH, $version);
        }

        /**
         * Get plugin settings.
         *
         * @return array
         */
        public function get_settings()
        {
            return $this->settings;
        }
    }

    // Initialize plugin
    function acf_icomoon()
    {
        return ACFIcoMoonPlugin::instance();
    }

    // Let's roll!
    acf_icomoon();

endif;
endif;