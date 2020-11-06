<?php


class WeatherWidget extends WP_Widget {
    // The construct part  
    function __construct() {
        parent::__construct(
            // Base ID of your widget
            'weather_widget', 
              
            // Widget name will appear in UI
            __('Weather Widget', 'weather_widget_domain'), 
              
            // Widget description
            array(
                'description' => __( 'Weather Widget', 'weather_widget_domain' ),
            ),
        );
    }
    
    // Creating widget front-end
    public function widget( $args, $instance ) {
        $title = apply_filters( 'widget_title', $instance['title'] );
  
        // before and after widget arguments are defined by themes
        echo $args['before_widget'];
        if ( ! empty( $title ) )
        echo $args['before_title'] . $title . $args['after_title'];
          
        // This is where you run the code and display the output
        echo __( '<div class="weather-plugin"></div>', 'wpb_widget_domain' );
        echo $args['after_widget'];
    }
            
    // Creating widget Backend 
    public function form( $instance ) {
        if ( isset( $instance[ 'title' ] ) ) {
            $title = $instance[ 'title' ];
        } else {
            $title = __( 'New title', 'wpb_widget_domain' );
        }?>
        <p>This is a widget example</p>
        <?php
    }
        
    // Updating widget replacing old instances with new
    public function update( $new_instance, $old_instance ) {
        $instance = array();
        $instance['title'] = ( ! empty( $new_instance['title'] ) ) ? strip_tags( $new_instance['title'] ) : '';
        return $instance;
    }
}