import {MetarData, TafData} from './weather';
import {Forecast} from './weather'; 
import {Metar} from './metar';

export class Taf {
    constructor(
        private container: JQuery,
        private lang: string,
    ) {}

    public display(data: TafData): Promise<TafData> {
        return new Promise((resolve, reject) => {
            var forecast: {[name: string]: {
                container: JQuery
                timeline: JQuery
                data: any
            }} = {};
      
            if (!data.forecast.length) {
              return resolve(data);
            }
            
            // Flight rules switch
            const switchBox = jQuery('<div class="switch-box source-selector"></div>');
            switchBox.append('<label for="default" class="switch-box-label">MVFR</label>');
            const switchBtn = jQuery('<input id="default" class="switch-box-input" type="checkbox" />');
            switchBox.append(switchBtn);
            switchBox.append('<label for="default" class="switch-box-slider"></label>');
            switchBox.append('<label for="default" class="switch-box-label">IFR</label>');
            this.container.append(switchBox);
      
            switchBtn.on('change', (event: JQuery.ChangeEvent) => {
              var flightRule = (jQuery(event.target).is(":checked")) ? 'IFR':'MVFR';
      
              Object.keys(forecast).forEach((name) => {
                forecast[name].container.removeClass('visible');
              });
      
              if (forecast[flightRule] &&forecast[flightRule].container) {
                forecast[flightRule].container.addClass('visible');
              }
            });
      
      
            var forecastContainer = jQuery('<div class="forecast"></div>');
            this.container.append(forecastContainer);
            
            data.forecast.forEach((elt: Forecast) => {
                if (!forecast[elt.flight_rules]) {
                    forecast[elt.flight_rules] = {
                    container: jQuery('<div class="' + elt.flight_rules + '"></div>'),
                    timeline: jQuery('<div class="timeline"></div>'),
                    data: {},
                    };
                    forecastContainer.append(forecast[elt.flight_rules].container);
                    forecast[elt.flight_rules].container.append(forecast[elt.flight_rules].timeline);
                }

                forecast[elt.flight_rules].data[elt.end_time.dt] = elt;
              
                const metarLike =  elt as any;
                metarLike.frame = jQuery('<div class="tab"></div>');
              
                forecast[elt.flight_rules].container.append(metarLike.frame);
                metarLike.units = data.units;
      
                const t = new Date(elt.end_time.dt);
                var btn = jQuery('<button class="time-tab">' + t.getDate().leading(2) + '/' + t.getMonth() + ' ' + t.getHours().leading(2) + ':' + t.getMinutes().leading(2) + '</button>');
                forecast[elt.flight_rules].timeline.append(btn);
      
                if (Object.keys(forecast[elt.flight_rules].data).length == 1) {
                    forecast[elt.flight_rules].data[elt.end_time.dt].frame.addClass('visible');
                    btn.addClass('selected');
                } 
        
                btn.on('click', (event: JQuery.ClickEvent) => {
                    forecast[elt.flight_rules].timeline.children().each((index: number, element: HTMLElement) => {
                        jQuery(element).removeClass('selected');
                    });
                    jQuery(event.target).addClass('selected');
        
                    forecast[elt.flight_rules].container.find('div.tab').each((index: number, element: HTMLElement) => {
                        jQuery(element).removeClass('visible');
                    });
        
                    forecast[elt.flight_rules].data[elt.end_time.dt].frame.addClass('visible');
                });
      
      
                new Metar(metarLike.frame, this.lang).display(metarLike);
            });
      
            forecast.MVFR.container.addClass('visible');
          
            // Raw Taf
            if (data.raw) {
              this.container.append('<div class="form-element"><label>Taf:</label><span class="value">'+ data.raw +'</span></div>');
            }
      
            resolve(data);
          });
    }
}