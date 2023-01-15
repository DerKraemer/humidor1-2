let FMag = 0
let FZig = 0
let Alt = 0
let Alt2 = 0
let Stundentimer = 0
oledssd1306.initDisplay()
oledssd1306.setTextXY(0, 0)
oledssd1306.writeString("Magazin=")
oledssd1306.setTextXY(0, 13)
oledssd1306.writeString("%")
oledssd1306.setTextXY(2, 0)
oledssd1306.writeString("Feuchte=")
oledssd1306.setTextXY(2, 13)
oledssd1306.writeString("%")
oledssd1306.setTextXY(3, 0)
oledssd1306.writeString("Feuchter:")
oledssd1306.setTextXY(4, 0)
oledssd1306.writeString("Umlüftung:")
loops.everyInterval(2000, function () {
    DHT11.setPin(DigitalPin.C17)
    oledssd1306.setTextXY(2, 10)
    FZig = DHT11.humidity()
    oledssd1306.writeNumber(FZig)
    DHT11.setPin(DigitalPin.C16)
    oledssd1306.setTextXY(0, 10)
    if (FMag < 80) {
        if (!(Alt2)) {
            oledssd1306.setTextXY(6, 0)
            oledssd1306.writeString("Magazin füllen!")
            Alt2 = 1
        } else {
            oledssd1306.setTextXY(6, 0)
            oledssd1306.clearRange(15)
            Alt2 = 0
        }
    } else {
        oledssd1306.setTextXY(6, 0)
        oledssd1306.clearRange(15)
    }
    oledssd1306.setTextXY(0, 10)
    FMag = DHT11.humidity()
    oledssd1306.writeNumber(FMag)
    if (FZig < 68) {
        if (!(Alt)) {
            motors.dualMotorPower(Motor.AB, 100)
            Alt = 1
            oledssd1306.setTextXY(3, 11)
            oledssd1306.writeString("AN ")
            oledssd1306.setTextXY(4, 11)
            oledssd1306.writeString("AN ")
        }
    } else {
        if (FZig > 72) {
            motors.dualMotorPower(Motor.AB, 0)
            Alt = 0
            oledssd1306.setTextXY(3, 11)
            oledssd1306.writeString("AUS")
            oledssd1306.setTextXY(4, 11)
            oledssd1306.writeString("AUS")
        }
    }
})
loops.everyInterval(3600000, function () {
    if (Stundentimer) {
        Stundentimer = 0
    } else {
        Stundentimer = 1
    }
})
