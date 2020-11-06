import {Controller} from './controller';
import { DownloadManager, DownloadPolicy } from './download-manager';

jQuery(() => {
    
    new Controller(
        new DownloadManager(
            {
                taf: new DownloadPolicy(
                    3*60*60,
                    10*60,
                ),
                metar: new DownloadPolicy(
                    30*60,
                    //5*60,
                    2*60,
                ),
            },
            true,
        )
    ).init(jQuery('div.weather-plugin'));
});