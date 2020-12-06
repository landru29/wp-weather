
export class Temperature {
    private ctx: any;
    private centerX: number;
    private centerY: number;

    constructor(elt: HTMLCanvasElement) {
        this.ctx = elt.getContext("2d");

        this.centerY = 130 - (2/3) * elt.height;
        this.centerX = elt.width / 2;
    }

    private clear() {
        this.ctx.clearRect(0, 0, this.centerX * 2, this.centerY * 2);
    }

    display(dew: number, temp: number, lang: string) {
        const titles: {[lang: string]: {[key: string]: string}} = {
            fr: {
              temp: 'Temp',
              dew: 'Rosée',
            },
            en: {
              temp: 'Temp',
              dew: 'Dew',
            }
        };

        this.clear();

        this.temperatures(temp, dew, titles[lang]);
        this.mainPath();

        for (var i=-10; i<40; i+=2) {
            if (i % 10 == 0) {
                this.gradMain(i);
            } else {
                this.gradMin(i);
            }
        }
    }

    gradMain(value: number) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate(this.centerX, -this.centerY);
        this.ctx.lineJoin = 'miter';
        this.ctx.strokeStyle = 'rgb(0, 0, 0)';
        this.ctx.lineCap = 'butt';
        this.ctx.miterLimit = 4;
        this.ctx.lineWidth = 0.8;
        this.ctx.moveTo(-3.316646, 130-1.25*value);
        this.ctx.lineTo(-0.490521, 130-1.25*value);
        this.ctx.stroke();
        this.ctx.restore();
    }

    gradMin(value: number) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate(this.centerX, -this.centerY);
        this.ctx.lineJoin = 'miter';
        this.ctx.strokeStyle = 'rgb(0, 0, 0)';
        this.ctx.lineCap = 'butt';
        this.ctx.miterLimit = 4;
        this.ctx.lineWidth = 0.8;
        this.ctx.moveTo(-3.316646, 130-1.25*value);
        this.ctx.lineTo(-1.844007, 130-1.25*value);
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    temperatures(temp: number, dew: number, labels: {[key: string]: string}) {
        const water = 118-1.25*dew
        
        // #water
        this.ctx.save();
        this.ctx.translate(this.centerX, -this.centerY);
        this.ctx.beginPath();
	    this.ctx.globalAlpha = 1.0;
	    this.ctx.lineJoin = 'miter';
	    this.ctx.lineCap = 'round';
	    this.ctx.miterLimit = 4;
	    this.ctx.lineWidth = 0.282330;
	    this.ctx.fillStyle = 'rgb(76, 160, 240)';
	    this.ctx.moveTo(3.306247, 148.251010);
	    this.ctx.bezierCurveTo(6.666010, 149.882350, 8.391984, 153.585790, 7.536901, 157.172460);
	    this.ctx.lineTo(7.536897, 157.172460);
	    this.ctx.bezierCurveTo(6.681814, 160.759120, 3.470619, 163.285520, -0.216532, 163.272460);
	    this.ctx.bezierCurveTo(-3.903689, 163.260060, -7.096908, 160.710300, -7.926552, 157.117680);
	    this.ctx.bezierCurveTo(-8.756190, 153.525040, -7.004019, 149.833930, -3.658104, 148.247110);
	    this.ctx.lineTo(-3.637364, water);
	    this.ctx.lineTo(3.287017, water);
        this.ctx.fill();
        this.ctx.restore();
        // this.ctx.save();
        // this.ctx.beginPath();
        // this.ctx.translate(this.centerX, 0);
	    // this.ctx.globalAlpha = 1.0;
	    // this.ctx.lineJoin = 'miter';
	    // this.ctx.lineCap = 'round';
	    // this.ctx.miterLimit = 4;
	    // this.ctx.lineWidth = 0.282330;
	    // this.ctx.fillStyle = 'rgb(76, 160, 240)';
	    // this.ctx.moveTo(3.306247, 93.482343);
	    // this.ctx.bezierCurveTo(6.666010, 95.113683, 8.391984, 98.817123, 7.536901, 102.403790);
	    // this.ctx.lineTo(7.536897, 102.403790);
	    // this.ctx.bezierCurveTo(6.681814, 105.990450, 3.470619, 108.516850, -0.216532, 108.503790);
	    // this.ctx.bezierCurveTo(-3.903689, 108.491390, -7.096908, 105.941630, -7.926552, 102.349010);
	    // this.ctx.bezierCurveTo(-8.756190, 98.756373, -7.004019, 95.065263, -3.658104, 93.478443);
	    // this.ctx.lineTo(-3.637364, water);
	    // this.ctx.lineTo(3.287017, water);
	    // this.ctx.fill();
        // this.ctx.restore();
// 
        // #dew
        this.ctx.save();
        this.ctx.translate(this.centerX, -this.centerY);
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "right";
        this.ctx.lineJoin = 'miter';
        this.ctx.lineCap = 'butt';
        this.ctx.lineWidth = 0.070004;
        this.ctx.fillStyle = 'rgb(0, 0, 0)';
        this.ctx.font = "normal normal 14.11111069px sans-serif";
        this.ctx.fillText(`${labels.dew} ${dew}°c`, -5.506297, water);
        this.ctx.restore();


        // #ground
        this.ctx.save();
        this.ctx.translate(this.centerX, -this.centerY);
        const ground = 118-1.25*temp;
        if (temp > dew) {
            const h = water-ground;
            this.ctx.beginPath();
            this.ctx.globalAlpha = 1.0;
            this.ctx.lineJoin = 'miter';
            this.ctx.lineCap = 'round';
            this.ctx.miterLimit = 4;
            this.ctx.lineWidth = 0.220089;
            this.ctx.fillStyle = 'rgb(76, 240, 166)';
            this.ctx.rect(-3.424305, ground, 6.848690, h);
            this.ctx.fill();
        } else {
            const h = ground - water;
            this.ctx.beginPath();
            this.ctx.globalAlpha = 1.0;
            this.ctx.lineJoin = 'miter';
            this.ctx.lineCap = 'round';
            this.ctx.miterLimit = 4;
            this.ctx.lineWidth = 0.220089;
            this.ctx.fillStyle = 'rgb(76, 240, 166)';
            this.ctx.rect(-0.424305, water, 4.6, h);
            this.ctx.fill();
        }
        this.ctx.restore();

        // #ambient
        this.ctx.save();
        this.ctx.translate(this.centerX, -this.centerY);
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "left";
        this.ctx.lineJoin = 'miter';
        this.ctx.lineCap = 'butt';
        this.ctx.lineWidth = 0.070004;
        this.ctx.fillStyle = 'rgb(0, 0, 0)';
        this.ctx.font = "normal normal 14.11111069px sans-serif";
        this.ctx.fillText(`${labels.temp} ${temp}°c`, 7.427047, ground);
        this.ctx.restore();
    }

    mainPath() {
        this.ctx.save();
        this.ctx.translate(this.centerX, -this.centerY);
        this.ctx.beginPath();
	    this.ctx.globalAlpha = 1.0;
	    this.ctx.lineJoin = 'miter';
	    this.ctx.strokeStyle = 'rgb(0, 0, 0)';
	    this.ctx.lineCap = 'round';
	    this.ctx.miterLimit = 4;
	    this.ctx.lineWidth = 0.546893;
	    this.ctx.moveTo(7.399523, 157.172460);
	    this.ctx.bezierCurveTo(6.544440, 160.759120, 3.333243, 163.285520, -0.353908, 163.272460);
	    this.ctx.bezierCurveTo(-4.041064, 163.260060, -7.234283, 160.710300, -8.063927, 157.117680);
	    this.ctx.bezierCurveTo(-8.893564, 153.525040, -7.141395, 149.833930, -3.795480, 148.247110);
	    this.ctx.lineTo(-3.733330, 58.828684);
	    this.ctx.bezierCurveTo(-3.721520, 57.592884, -3.054413, 56.454134, -1.977368, 55.849594);
	    this.ctx.bezierCurveTo(-0.900325, 55.245034, 0.419135, 55.268714, 1.473777, 55.911494);
	    this.ctx.bezierCurveTo(2.528417, 56.554384, 3.154061, 57.716314, 3.111252, 58.889984);
	    this.ctx.lineTo(3.168862, 148.251010);
	    this.ctx.bezierCurveTo(6.528629, 149.882360, 8.254603, 153.585800, 7.399522, 157.172480);
        this.ctx.stroke();
        this.ctx.restore();
        // this.ctx.save();
        // this.ctx.translate(this.centerX, 0);
        // this.ctx.beginPath();
	    // this.ctx.globalAlpha = 1.0;
	    // this.ctx.lineJoin = 'miter';
	    // this.ctx.strokeStyle = 'rgb(0, 0, 0)';
	    // this.ctx.lineCap = 'round';
	    // this.ctx.miterLimit = 4;
	    // this.ctx.lineWidth = 0.546893;
	    // this.ctx.moveTo(7.399523, 102.403790);
	    // this.ctx.bezierCurveTo(6.544440, 105.990450, 3.333243, 108.516850, -0.353908, 108.503790);
	    // this.ctx.bezierCurveTo(-4.041064, 108.491390, -7.234283, 105.941630, -8.063927, 102.349010);
	    // this.ctx.bezierCurveTo(-8.893564, 98.756373, -7.141395, 95.065263, -3.795480, 93.478443);
	    // this.ctx.lineTo(-3.733330, 4.060014);
	    // this.ctx.bezierCurveTo(-3.721520, 2.824214, -3.054413, 1.685464, -1.977368, 1.080924);
	    // this.ctx.bezierCurveTo(-0.900325, 0.476364, 0.419135, 0.500044, 1.473777, 1.142824);
	    // this.ctx.bezierCurveTo(2.528417, 1.785714, 3.154061, 2.947644, 3.111252, 4.121314);
	    // this.ctx.lineTo(3.168862, 93.482343);
	    // this.ctx.bezierCurveTo(6.528629, 95.113693, 8.254603, 98.817133, 7.399522, 102.403810);
	    // this.ctx.stroke();
        // this.ctx.restore();
    }

}