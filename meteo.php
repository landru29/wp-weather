<?php
/**
 * @package Meteo
 * @version 1.0.0
 */
/*
Plugin Name: Meteo
Plugin URI: https://account.avwx.rest/
Description: This is a display of meteo data
Author: Cyrille Meichel
Version: 1.0.0
Author URI: https://www.linkedin.com/in/cmeichel/
*/

if (!function_exists('add_action')) {
    echo 'go out of here';
    die;
}

define('WP_DEBUG', true);

if (!defined('ABSPATH')) {
    define('ABSPATH', dirname(__FILE__) . '/');
}

require_once (ABSPATH . 'wp-settings.php');



class MeteoPlugin {

    public $plugin;

    function __construct() {
        $this->plugin = plugin_basename(__FILE__);
    }

    function register() {
        add_action('admin_menu', array($this, 'addSubmenuPage'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue'));
        
        add_filter('plugin_action_links_' . $this->plugin, array($this, 'settingsLink'));

        require_once (plugin_dir_path(__FILE__) . '/wp-admin.php');
        require_once (plugin_dir_path(__FILE__) . '/wp-rest.php');
    }

    function settingsLink($links) {
        $settings = '<a href="options-general.php?page=meteo">Settings</a>';
        array_push($links, $settings);
        return $links;
    }

    function activate() {

    }

    function deactivate() {

    }

    function uninstall() {
        require_once (plugin_dir_path(__FILE__) . '/wp-uninstall.php');
    }

    function addSubmenuPage() {

        $page_title = 'Configure meteo';
        $menu_title = 'Meteo';
        $capability = 'manage_options';
        $slug = 'meteo';
        $callback = array( $this, 'templateAdmin' );
        $icon = 'dashicons-airplane';
        $position = 100;

        add_menu_page( $page_title, $menu_title, $capability, $slug, $callback, $icon, $position );
    }

    function templateAdmin() {
        require_once (plugin_dir_path(__FILE__) . '/templates/admin.php');
    }

    function scripts() {
        echo "<script>var meteoMetarURL = '/wp-json/meteo/v1/metar';</script>";
        echo plugin_dir_url(__FILE__);
    }

    function enqueue() {
        wp_enqueue_style('meteopluginstyle', plugins_url('/assets/meteo.css', __FILE__));
        wp_enqueue_script('meteopluginscript', plugins_url('/assets/script.js', __FILE__));

        add_action('wp_print_scripts', array($this, 'scripts'));
    }
}

if ( class_exists('MeteoPlugin')) {
    $meteoPlugin = new MeteoPlugin();
    $meteoPlugin->register();
}

// activation
register_activation_hook(__FILE__, array($meteoPlugin, 'activate'));

// deactivation
register_deactivation_hook(__FILE__, array($meteoPlugin, 'deactivate'));


// uninstall
register_uninstall_hook(__FILE__, array($meteoPlugin, 'uninstall'));

