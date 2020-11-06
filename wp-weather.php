<?php
/**
 * @package Weather
 * @version 1.0.0
 */
/*
Plugin Name: Weather
Plugin URI: https://account.avwx.rest/
Description: This is a display of weather data
Author: Cyrille Meichel
Version: 1.0.0
Author URI: https://www.linkedin.com/in/cmeichel/
*/

// define('WP_DEBUG', true);

if (!function_exists('add_action')) {
    echo 'go out of here';
    die;
}



if (!defined('ABSPATH')) {
    define('ABSPATH', dirname(__FILE__) . '/');
}

require_once (ABSPATH . 'wp-settings.php');



class WeatherPlugin {

    public $plugin;

    function __construct() {
        $this->plugin = plugin_basename(__FILE__);
    }

    function register() {
        add_action('admin_menu', array($this, 'addSubmenuPage'));
        add_action('wp_enqueue_scripts', array($this, 'enqueueScriptAndStyle'));
        add_action('admin_enqueue_scripts', array($this, 'adminEnqueueScriptAndStyle'));
        add_filter('plugin_action_links_' . $this->plugin, array($this, 'settingsLink'));
        add_action( 'widgets_init', array($this, 'loadWidget'));
        add_shortcode( 'weather', array($this, 'displayPlugin'));

        require_once (plugin_dir_path(__FILE__) . '/wp-admin.php');
        require_once (plugin_dir_path(__FILE__) . '/wp-rest.php');


        // activation
        register_activation_hook(__FILE__, array($this, 'activate'));

        // deactivation
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));


    }

    function loadWidget() {
        require_once (plugin_dir_path(__FILE__) . '/wp-widget.php');
        register_widget('WeatherWidget');
    }

    function displayPlugin( $atts, $content = null) {
        return '<div class="weather-plugin"></div>';
    }

    function settingsLink($links) {
        $settings = '<a href="options-general.php?page=weather">Settings</a>';
        array_push($links, $settings);
        return $links;
    }

    function activate() {

    }

    function deactivate() {

    }

    function addSubmenuPage() {
        add_menu_page(
            'Configure weather',
            'Weather',
            'manage_options',
            'weather',
            array( $this, 'templateAdmin' ),
            'dashicons-airplane',
            100,
        );
    }

    function templateAdmin() {
        require_once (plugin_dir_path(__FILE__) . '/templates/admin.php');
    }

    function scripts() {
        echo implode("\n", array(
            '<script>',
            'var weatherConfig = {',
            '    url: {',
            '        metar: "'. get_rest_url(null, 'weather/v1/metar') . '",',
            '        taf: "'. get_rest_url(null, 'weather/v1/taf') . '",',
            '    },',
            '    lang: "'.explode('_', get_locale())[0].'",',
            '    loadingImg: "' . plugin_dir_url(__FILE__).'/assets/loading.gif",',
            '    locations: [',
        ));
        $list = explode('/', get_option( 'weather_location' ));
        array_walk(
            $list,
            function($elt) {
                if (!$elt) {
                    return;
                }
                preg_match_all('/^([a-zA-Z]{4})\s*\(?([^\)]*)\)?/', trim($elt), $matches);
                if (count($matches) && count($matches[1])) {
                    $label = count($matches)>1 ? $matches[2][0]: $matches[1][0];
                    echo "{name: '" . $matches[1][0] . "', label: '" . $label . "'},\n";
                }
                return null;
            },
        );
        echo(implode("\n", array(
            '    ],',
            '};',
            '</script>',
        )));
    }

    function enqueueScriptAndStyle() {
        wp_enqueue_style('weatherpluginstyle', plugins_url('/assets/weather.css', __FILE__));
        wp_enqueue_script( 'jquery' );
        wp_enqueue_script('weatherpluginscript', plugins_url('/assets/script.js', __FILE__));

        add_action('wp_print_scripts', array($this, 'scripts'));
    }

    function adminEnqueueScriptAndStyle() {
        wp_enqueue_style('weatherpluginstyle', plugins_url('/assets/admin.css', __FILE__));
    }
}

if ( class_exists('WeatherPlugin')) {
    $weatherPlugin = new WeatherPlugin();
    $weatherPlugin->register();
}
