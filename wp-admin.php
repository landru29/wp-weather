<?php
if (!function_exists('add_action')) {
    echo 'go out of here';
    die;
}

if (!defined('ABSPATH')) {
    define('ABSPATH', dirname(__FILE__) . '/');
}

class WeatherAdmin {

    private $slug;

    function __construct() {
        $this->slug="weather";
    }

    function register() {
        add_action('admin_init', array($this, 'registerSettings'));
        add_action('admin_notices', array($this, 'adminNotices'));
        add_action( 'admin_init', array( $this, 'setupFields' ) );
    }

    function setupFields() {
        add_settings_field( 'weather_token', 'API token', array( $this, 'fieldTokenCallback' ), $this->slug, 'weather_section' );
        add_settings_field( 'weather_location', 'ICAO location: XXXX (description)', array( $this, 'fieldLocationCallback' ), $this->slug, 'weather_section' );
    }

    function registerSettings() {
        add_settings_section( 'weather_section', 'Configuration', array( $this, 'sectionCallback' ), $this->slug );
        register_setting( $this->slug, 'weather_token' );
        register_setting( $this->slug, 'weather_location' );
    }

    function fieldTokenCallback($arguments) {
        echo '<input name="weather_token" id="weather_token" type="text" value="' . get_option( 'weather_token' ) . '" placeholder="API token"/>';
        
    }

    function fieldLocationCallback($arguments) {
        $locations = explode('/', get_option( 'weather_location' ));
        echo '<div id="location-set">';
        foreach ($locations as $index => $location) {
            echo '<input class="location" name="location'.$index.'" id="location'.$index.'" type="text" value="' . $location . '" placeholder="ICAO location"/>';
        }
        echo '</div><button type="button" onclick="weatherAddLoc()">+</button>';
    }

    function sectionCallback($arguments) {
        switch( $arguments['id'] ){
            case 'weather':
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

if ( class_exists('WeatherAdmin')) {
    $weatherPlugin = new WeatherAdmin();
    $weatherPlugin->register();
}