<?php
if (!function_exists('add_action')) {
    echo 'go out of here';
    die;
}

define('WP_DEBUG', true);

if (!defined('ABSPATH')) {
    define('ABSPATH', dirname(__FILE__) . '/');
}

class MeteoAdmin {

    private $slug;

    function __construct() {
        $this->slug="meteo";
    }

    function register() {
        add_action('admin_init', array($this, 'registerSettings'));
        add_action('admin_notices', array($this, 'adminNotices'));
        add_action( 'admin_init', array( $this, 'setupFields' ) );
    }

    function setupFields() {
        add_settings_field( 'meteo_token', 'API token', array( $this, 'fieldTokenCallback' ), $this->slug, 'meteo_section' );
        add_settings_field( 'meteo_location', 'ICAO location', array( $this, 'fieldLocationCallback' ), $this->slug, 'meteo_section' );
    }

    function registerSettings() {
        add_settings_section( 'meteo_section', 'Configuration', array( $this, 'sectionCallback' ), $this->slug );
        register_setting( $this->slug, 'meteo_token' );
        register_setting( $this->slug, 'meteo_location' );
    }

    function fieldTokenCallback($arguments) {
        echo '<input name="meteo_token" id="meteo_token" type="text" value="' . get_option( 'meteo_token' ) . '" placeholder="API token"/>';
        
    }

    function fieldLocationCallback($arguments) {
        echo '<input name="meteo_location" id="meteo_location" type="text" value="' . get_option( 'meteo_location' ) . '" placeholder="ICAO location"/>';
        
    }

    function sectionCallback($arguments) {
        switch( $arguments['id'] ){
            case 'meteo':
                echo 'configure https://account.avwx.rest';
                break;
        }
    }

    function validateToken( $input) {
        return $input;
    }

    function validateLocation( $input) {
        return $input;
    }

    function adminNotices(){
        settings_errors();
     }

}

if ( class_exists('MeteoAdmin')) {
    $meteoPlugin = new MeteoAdmin();
    $meteoPlugin->register();
}