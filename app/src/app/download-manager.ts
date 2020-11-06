import {WeatherData, MetaData, Location} from './weather';

export class DownloadManager {
    private cache: {[id: string]: Cache} = {}
    private timeoutHandler: number | null = null;

    constructor(
        private policy: {[tabName: string]: DownloadPolicy},
        private debug = false,
    ) {}

    public load(route: string, tabName: string, location: Location, lang: string, display: (d: WeatherData) => void): void {
        this.reloadAt(null, route, tabName, location, lang, display);
    }

    private loadData(route: string, tabName: string, location: Location, lang: string, display: (d: WeatherData) => void):  Promise<Cache> {
        const cacheName = this.cacheName(tabName, location);
        return new Promise((resolve, reject) => {
            const cache = this.cache[cacheName];

            if (this.debug && cache && cache.hasExpired()) {
                console.log('[CACHE] expired at', cache.expireAt);
            }
            
            if (cache && !cache.hasExpired()) {
                if (this.debug) {
                    console.log('[CACHE]', cacheName, cache.data);
                }
                return resolve(cache);
            }

            jQuery.getJSON(
                [route, location.name].join('/'),
                () => {},
            ).done(
                (data: WeatherData) => {
                    if (this.debug) {
                        console.log('[GET]', cacheName, data);
                    }

                    const nextExpiration = this.policy[tabName] ? this.policy[tabName].nextExpiration(data) : null;

                    this.cache[cacheName] = new Cache(
                        data,
                        nextExpiration,
                    );

                    resolve(this.cache[cacheName]);
                }
            ).fail(() => {
                reject(lang == 'fr' ? 'Saperlipopette ! je n\'arrive pas à récupérer les données.' : 'OMG ! I\'m not able to retrieve data.');
            });
        }).then((cache: any) => {
            display((cache as Cache).data);
            const cacheExpireAt = (cache as Cache).expireAt;

            if ((cacheExpireAt?.getTime() || 0)> new Date().getTime()) {
                if (this.debug) {
                    console.log('will reload', tabName, location.name, 'at', `${cacheExpireAt?.getHours()}:${cacheExpireAt?.getMinutes()}`);
                }
                this.reloadAt(cacheExpireAt, route, tabName, location, lang, display);
            }

            return cache;
        }).catch((err) => {
            console.warn(err);
            display({error: err, station: location.name} as WeatherData);
            return Promise.reject(err);
        });
    }

    private reloadAt(when: Date | null, route: string, tabName: string, location: Location, lang: string, display: (d: WeatherData) => void): void {
        if (this.timeoutHandler != null) {
            clearTimeout(this.timeoutHandler);
            this.timeoutHandler = null;
        }
        if (when == null) {
            this.loadData(route, tabName, location, lang, display);
            return;
        }

        const delay = when.getTime() - new Date().getTime();
        if (delay <= 100) {
            return this.reloadAt(null, route, tabName, location, lang, display);
        }

        this.timeoutHandler = setTimeout(() => {
            this.loadData(route, tabName, location, lang, display);
        }, delay) as any;
    }

    private cacheName(tabName: string, location: Location): string {
        return `${tabName}-${location.name}`;
    }
}

export class DownloadPolicy {
    constructor (
        private frequencySecond: number,
        private retrySecond: number,
    ) {}

    public nextExpiration(data: MetaData): Date | null {
        if (this.frequencySecond<=0) {
            return null
        }
        const dataTs = new Date(data.time.dt).getTime();
        const nowTs = new Date().getTime();

        const dataTsShouldBe = Math.floor(nowTs / (this.frequencySecond * 1000)) * this.frequencySecond * 1000;
        const tickAfterDataTs = Math.ceil(nowTs / (this.frequencySecond * 1000)) * this.frequencySecond * 1000;
        
        if (dataTsShouldBe == dataTs) {
            return new Date(tickAfterDataTs);
        }

        return new Date(this.retrySecond*1000 + nowTs);
    }
}


class Cache {
    constructor(
        public data: WeatherData,
        public expireAt: Date | null,
    ) {}

    public hasExpired(): boolean {
        if (this.expireAt == null) {
            return true;
        }

        return this.expireAt.getTime()< (new Date().getTime() + 1000);
    }
}