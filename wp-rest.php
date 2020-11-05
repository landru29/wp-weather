<?php

if (!function_exists('add_action')) {
    echo 'go out of here';
    die;
}

define('WP_DEBUG', true);

if (!defined('ABSPATH')) {
    define('ABSPATH', dirname(__FILE__) . '/');
}

class MeteoRest {

    function register() {
        add_action( 'rest_api_init',  array($this, 'registerRoute'));
    }

    function registerRoute() {
        register_rest_route( 'meteo/v1', '/metar', array(
          'methods' => 'GET',
          'callback' => array($this, 'metarRoute'),
        ) );
    }

    function metarRoute($data) {
        $opts = array(
            'method' => 'GET',
            'headers' => array(
                'Accept' => "application/json",
                'Authorization' => get_option( 'meteo_token' ),
            ),
        );


        $data = wp_remote_get(
            'https://avwx.rest/api/metar/'.get_option( 'meteo_location' ).'?options=&airport=true&reporting=true&format=json&onfail=cache',
            $opts,
        );

        return json_decode($data['body']);
    }

}



if ( class_exists('MeteoRest')) {
    $meteoPlugin = new MeteoRest();
    $meteoPlugin->register();
}
