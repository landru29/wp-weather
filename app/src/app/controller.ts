import {Config, Location, MetarData, TafData, MetaData, WeatherData} from './weather';
import {Metar} from './metar';
import {Taf} from './taf';
import {DownloadManager} from './download-manager';

declare global {
    interface Number {
        leading: (size: number, leading?: string) => string;
    }
}

Number.prototype.leading = function(size: number, leading = '0') : string {
    return (Array(size).fill(leading).join('') + this).substr(-size);
}


export class Controller {

    private config: Config;
    private currentTab = 'metar';
    private currentLocation: Location;


    constructor (private dl: DownloadManager) {
        this.config = (window as any).weatherConfig as Config;
        this.currentLocation = this.config.locations[0];
    }

    // getLang provides the language
    getLang (): string {
        return this.config.lang == 'fr' ? this.config.lang : 'en';
    };

    // tabShowOnly hides all tabs and show only the specifieds one
    tabShowOnly(className: string): void {
        jQuery('div.weather-widget-placeholder').children().each((index: number, element: HTMLElement) => {
            jQuery(element).css("display","none");
            jQuery('.' + className).css("display","block");
        })
    }

    // addTab adds a new tab in the main container
    addTab(name: string, label: string, tabs: JQuery, container: JQuery, active=false) {
        const button = jQuery('<button class="' + (active ? 'selected' : '') +  '">' + label + '</button>');
        button.on('click', (event: JQuery.ClickEvent) => {
            tabs.children().each((index: number, element: HTMLElement) => {
                jQuery(element).removeClass('selected');
            });
            jQuery(event.currentTarget).addClass('selected');

            this.tabShowOnly('weather-loading');
            this.currentTab = name;
            
            this.loadWeather(name, this.currentLocation);
        });

        tabs.append(button);
        container.append('<div class="tab-' + name + '"></div>');
    }

    loadWeather(tabName: string, location: Location): void {
        this.dl.load(this.config.url[tabName], tabName, location, this.getLang(), (d: WeatherData) => {
            const key = tabName + '-' + d.station.toUpperCase();

            this.tabShowOnly('tab-' + tabName);
            this.displayData(tabName, jQuery('div.tab-' + tabName), d);
        });
    }

    // displayData is th main fonction for displaying data from the API
    displayData(tabName: string, container: JQuery, data: WeatherData): Promise<any> {
        const lang = this.getLang();

        container.empty();

        // Handle error
        if (data.error) {
            const titles: {[lang: string]: string} = {
                fr: 'Erreur',
                en: 'Error',
            };

            container.append('<div class="form-element"><label>'+titles[lang]+':</label><span class="value">' + data.error + '</span></div>');
            return new Promise((resolve, reject) => {reject(titles[lang]);});
        }

        
        var ret: Promise<WeatherData>;
        switch (tabName) {
        case 'metar':
            ret = new Metar(container, lang).display(data as MetarData);
            break;
        case 'taf':
            ret = new Taf(container, lang).display(data as TafData);
            break;
        default:
            ret = new Promise((resolve, reject) => {reject("no displayer for " + tabName);});
        }

        return ret.then(() => {
            this.appendTime(container, data);
            return;
        });
    }


     // appendTime displays the time as a calendar
    appendTime(container: JQuery, data: MetaData) {
        const lang = this.getLang();

        if (data.time) {
        var months: {[lang: string]: string[]} = {
            fr: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'],
            en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        };
        var currentDate = new Date(data.time.dt);
        var month = months[lang][currentDate.getMonth()-1];
        var hour =  currentDate.getHours().leading(2);
        var minute = currentDate.getMinutes().leading(2);
        container.append('<span class="date"><span class="month">' + month + '</span><span class="day">'+ currentDate.getDate() +'</span></span>');
        container.append('<span class="time">'+ hour +':'+ minute +'</span>');
        }
    }



    init(mainContainer: JQuery) {
        if (mainContainer.length == 0 || !this.config || !this.config.locations) {
        return;
        }

        if (!this.config.locations.length) {
        console.warn("[weather]", "missing locations")
        return;
        }
        
        // Clear all
        mainContainer.empty();
        var lang = this.getLang();
        
        // Add title
        mainContainer.append('<h3 class="weather-title"></h3');
        
        // Add station selector
        var selection = jQuery('<select class="weather-location-select"></select>');
        mainContainer.append(selection);
        this.config.locations.forEach((element, index) => {
        var selected = index  ? '' : 'selected';
        selection.append('<option value="' + element.name + '" ' + selected + '>' + element.name +' (' + element.label + ')</option>');
        });
        selection.on('change', (event: JQuery.ChangeEvent) => {
            var location = jQuery(event.target).children("option:selected").val();
            var locs = this.config.locations.filter((elt: Location) => {
                return elt.name == `${location}`;
            });
            if (locs.length == 1) {
                this.currentLocation = locs[0];
                this.tabShowOnly("weather-loading");
                this.loadWeather(this.currentTab ? this.currentTab : 'metar', locs[0]);
            }
        });
    
        // Tab
        var tabs = jQuery('<div class="tabs"></div>');
        mainContainer.append(tabs);
    
    
        // Add data container
        var container = jQuery('<div class="weather-widget-placeholder"></div>');
        mainContainer.append(container);
        container.append('<img class="weather-loading" src="' + this.config.loadingImg + '">');
        this.addTab('metar', 'Metar', tabs, container, true);
        this.addTab('taf', 'Taf', tabs, container);
    
        // Diclaimer
        var disclaimer: {[lang: string]: string} = {
        fr: 'Toutes les données présentées sur ce site sont non certifiées : elles doivent être systématiquement controlées à partir de données officielles',
        en: 'All the data presented on this site are not certified: they must be systematically checked from official data',
        };
        mainContainer.append('<div class="disclaimer"><span class="dashicons dashicons-warning"></span>' + disclaimer[lang] + '</div>');
    
        if (!this.config.locations || this.config.locations.length == 0) {
        return;
        }
    
        this.loadWeather('metar', this.config.locations[0]);
    }
}