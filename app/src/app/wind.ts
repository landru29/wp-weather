
interface CardinalOption {
    color?: string
    width?: number
    height?: number
}


export class Wind {
    private ctx: any;
    private centerX: number;
    private centerY: number;
    private square: number;

    constructor(elt: HTMLCanvasElement) {
        this.ctx = elt.getContext("2d");

        this.centerY = elt.height / 2;
        this.centerX = elt.width / 2;
        this.square = (this.centerY>this.centerX ? this.centerX : this.centerY) * 2;

        this.clear();

        for(var i=0; i<360; i+=10) {
            this.displayMark(i, "#888");
        }

        // Secondary cardinal
        for(var i=45; i<360; i+=90) {
            this.displayCardinal(i, false, {color: "#cecece"});
            this.displayCardinal(i, true, {color: "#dfdfdf"});
        }

        // Primary cardinal
        for(var i=0; i<360; i+=90) {
            this.displayCardinal(i, false, {color: "#ccc"});
            this.displayCardinal(i, true, {color: "#ddd"});
        }
    
    }

    private clear() {
        this.ctx.clearRect(0, 0, this.centerX, this.centerY);
    }

    private displayCardinal(angle: number, left: boolean, opt?: CardinalOption) {
        const width = opt ? opt.width || this.square/15 : this.square/15;
        const height = opt ? opt.height || this.square/2 : this.square/2;
        const color = opt ? opt.color || "#ccc" : "#ccc";
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate(this.centerX, this.centerY);
        this.ctx.rotate(angle * Math.PI / 180);
        this.ctx.moveTo(left ? width : -width, -width, );
        this.ctx.lineTo(0, -height);
        this.ctx.lineTo(0, 0);
        this.ctx.lineTo(left ? width : -width, -width, );
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    }

    private displayMark(angle: number, color="#000") {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate(this.centerX, this.centerY);
        this.ctx.rotate(angle * Math.PI / 180);
        this.ctx.moveTo(0, -this.square/2);
        this.ctx.lineTo(0, -(this.square/2)*0.95);
        this.ctx.strokeStyle=color;
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }
    
    public displayWind(angle: number, force = "", size=18, color="#1d528e") {
        if (angle != null) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.translate(this.centerX, this.centerY);
            this.ctx.rotate(angle * Math.PI / 180);
            this.ctx.moveTo(0, -this.square/5);
            this.ctx.lineTo(0, -(this.square/2)*0.93);
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.restore();
        
            const arrow = this.square/25;
            const sharpen = 0.5;
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.translate(this.centerX, this.centerY);
            this.ctx.rotate(angle * Math.PI / 180);
            this.ctx.moveTo(arrow * sharpen, -arrow -this.square/5);
            this.ctx.lineTo(0, -this.square/5);
            this.ctx.lineTo(-arrow * sharpen, -arrow -this.square/5);
            this.ctx.moveTo(arrow * sharpen, -arrow -this.square/5);
            this.ctx.fillStyle = color;
            this.ctx.fill();
            this.ctx.closePath();
            this.ctx.restore();
        }

        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);
        this.ctx.font = `${size}px sans serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = color;
        if (angle != null) {
            this.ctx.fillText(`${angle.toFixed(0)}°`, 0, size/1.8);
        }
        this.ctx.fillText(`${force}`, 0, -size/1.8);
        this.ctx.restore();
    }
}
