import { Temperature } from './temperature';
import {MetarData} from './weather';
import { Wind } from './wind';

export class Metar {
    constructor(
        private container: JQuery,
        private lang: string,
    ) {}

    public display(data: MetarData): Promise<MetarData> {
        return new Promise((resolve, reject) => {
            const titles: {[lang: string]: {[key: string]: string}} = {
              fr: {
                wind: 'Vent',
                temp: 'Temp',
                dew: 'Rosée',
                pressure: 'Pression',
                visibility: 'Visibilité',
                error: 'Erreur',
                raw: 'Original',
              },
              en: {
                wind: 'Wind',
                temp: 'Temp',
                dew: 'Dew',
                pressure: 'Pressure',
                visibility: 'Visibility',
                error: 'error',
                raw: 'Original',
              }
            }
          
            // Wind
            if (data.wind_speed) {
              const canvas = jQuery('<canvas class="wind" width="100px" height="100px"></canvas>');
              const elt = canvas.get(0) as HTMLCanvasElement;
              this.container.append(canvas);
              new Wind(elt).displayWind(
                data.wind_direction.value, 
                `${data.wind_speed.value} ${data.units.wind_speed}`,
                15,
                '#ca2017'
              );
            }
          
            // Temperatures
            if (data.temperature) {
              const canvas = jQuery('<canvas class="temperature" width="150px" height="120px"></canvas>');
              const elt = canvas.get(0) as HTMLCanvasElement;
              this.container.append(canvas);
              new Temperature(elt).display(
                data && data.dewpoint ? data.dewpoint.value || 0 : 0,
                data && data.temperature ? data.temperature.value || 0 : 0,
                this.lang,
                );
            }
          
            // Pressure
            if (data.altimeter) {
              this.container.append('<div class="form-element"><label>'+titles[this.lang].pressure+':</label><span class="value">'+ data.altimeter.value + '<em>' + data.units.altimeter +'</em></span></div>');
            }

            // Visibility
            if (data.visibility) {
              var vis = '<span class="value">'+ data.visibility.value +'<em>'+ data.units.visibility+'</em></span>';
              if (data.visibility.repr == "CAVOK") {
                var cavok: {[lang: string]: string} = {
                  fr: 'Nuages et visibilité sont OK,',
                  en: 'Ceiling and visibility OK',
                }
                vis = '<span class="value">' + cavok[this.lang] + '</span>';
              }
              this.container.append('<div class="form-element"><label>'+titles[this.lang].visibility+':</label>' + vis + '</div>');
            }
          
            // Remarks
            if (data.remarks) {
              const remarks: {[lang: string]: {[key: string]: string}} = {
                fr:{
                  NOSIG : 'Aucun changement significatif dans les deux heures à venir',
                  BECMG : 'Changements prévus entre les heures indiquées',
                  GRADU : 'Changements prévus qui va arriver progressivement',
                  RAPID : 'Changements prévus rapidement (avant une demi-heure en moyenne)',
                  TEMPO : 'Fluctuations temporaires dans un bloc de 1 à 4 heures.',
                  INTER : 'Changements fréquents mais brefs',
                  TEND  : 'Tendance',
                },
                en: {
                  NOSIG : 'No significant change',
                  BECMG : 'Becoming',
                  GRADU : 'Gradualy',
                  RAPID : 'Rapidly',
                  TEMPO : 'Temporary changes expected',
                  INTER : 'Intermittent',
                  TEND  : 'Trend',
                },
              };
              var remark = remarks[this.lang][data.remarks]
              if (!remark) {
                remark = data.remarks;
              }
              this.container.append('<div class="form-element"><label>Remarque:</label><span class="value">'+ remark +'</span></div>')
            }
          
            // Clouds
            if (data.clouds && data.clouds.length) {
              var types: {[lang: string]: {[key: string]: string}} = {
                fr:{
                  SKC : 'aucun nuage [SKC]',
                  FEW : 'quelques nuages, 1/8 à 2/8 du ciel couvert [FEW]',
                  SCT : 'épars, 3/8 à 4/8 du ciel couvert [SCT]',
                  BKN : 'fragmenté, 5/8 à 7/8 du ciel couvert [BKN]',
                  OVC : 'couvert, 8/8 du ciel couvert [OVC]',
                  NSC : 'aucun nuage d\'une hauteur inférieure à 5 000 pieds ou sous l\'altitude minimale de secteur [NSC]',
                },
                en:{
                  SKC : 'sky [SKC]',
                  FEW : 'few, 1/8 - 2/8 [FEW]',
                  SCT : 'scattered, 3/8 - 4/8 [SCT]',
                  BKN : 'broken, 5/8 - 7/8 [BKN]',
                  OVC : 'overcast, 8/8 [OVC]',
                  NSC : 'No significant clouds [NSC]',
                },
              }
          
              var clouds = data.clouds.map((cloud) => {
                return '<li class="cloud-item"><span class="cloud-altitude">Alt '+ cloud.altitude + ' ' + data.units.altitude + ':</span> ' + types[this.lang][cloud.type] + '</li>'
              })
          
              this.container.append('<div class="form-element"><label>Nuages:</label><ul class="value">'+ clouds.join("\n") +'</ul></div>')
            }
          
            // Raw Metar
            if (data.raw) {
              this.container.append('<div class="form-element"><label>' + titles[this.lang].raw + ':</label><span class="value">'+ data.raw +'</span></div>');
            }
          
            resolve(data);
          });
    }
}