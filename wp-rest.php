<?php

if (!function_exists('add_action')) {
    echo 'go out of here';
    die;
}

if (!defined('ABSPATH')) {
    define('ABSPATH', dirname(__FILE__) . '/');
}

class WeatherRest {

    function register() {
        add_action( 'rest_api_init',  array($this, 'registerRoute'));
    }

    function registerRoute() {
        register_rest_route( 'weather/v1', '/metar/(?P<location>[a-zA-Z]{4})', array(
          'methods' => 'GET',
          'callback' => array($this, 'metarRoute'),
        ) );
        register_rest_route( 'weather/v1', '/taf/(?P<location>[a-zA-Z]{4})', array(
            'methods' => 'GET',
            'callback' => array($this, 'tafRoute'),
          ) );
    }

    function hasLocation($location) {
        $lst = explode('/', get_option( 'weather_location' ));
        $AllowedLocation = array_filter(
            array_map(
                function($elt) {
                    preg_match_all('/^([a-zA-Z]{4})/', trim($elt), $matches);
                    if (count($matches)) {
                        return $matches[1][0];
                    }
                    return null;
                },
                $lst,
            ),
            function ($elt) {
                return $elt != null;
            }
        );

        if (!in_array($location, $AllowedLocation)) {
            return false;
        }

        return true;
    }

    function metarRoute($req) {
        $opts = array(
            'method' => 'GET',
            'headers' => array(
                'Accept' => "application/json",
                'Authorization' => get_option( 'weather_token' ),
            ),
        );

        $location = $req['location'];
        if (!$this->hasLocation($location)) {
            status_header(403);
            return array(
                'error' => $location . ' is not allowed',
            );
        }
        
        $data = wp_remote_get(
            'https://avwx.rest/api/metar/'.$location.'?options=&airport=true&reporting=true&format=json&onfail=cache',
            $opts,
        );

    status_header(wp_remote_retrieve_response_code($data));

    return json_decode($data['body']);
    }

    function tafRoute($req) {
        $opts = array(
            'method' => 'GET',
            'headers' => array(
                'Accept' => "application/json",
                'Authorization' => get_option( 'weather_token' ),
            ),
        );

        $location = $req['location'];
        if (!$this->hasLocation($location)) {
            status_header(403);
            return array(
                'error' => $location . ' is not allowed',
            );
        }
        
        $data = wp_remote_get(
            'https://avwx.rest/api/taf/'.$location.'?options=summary&airport=true&reporting=true&format=json&onfail=cache',
            $opts,
        );

    status_header(wp_remote_retrieve_response_code($data));

    return json_decode($data['body']);
    }

}





if ( class_exists('WeatherRest')) {
    $weatherPlugin = new WeatherRest();
    $weatherPlugin->register();
}
