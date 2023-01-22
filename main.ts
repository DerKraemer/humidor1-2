let FMag = 0
let FZig = 0
let MLüfter = 0
let ULüfter = 0
let Blinker = 0
let Sekundentimer = 0
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
oledssd1306.writeString("Magazin:")
oledssd1306.setTextXY(4, 0)
oledssd1306.writeString("Umlüftung:")
loops.everyInterval(2000, function () {
    Sekundentimer = 1
})
// Motoransteuerung
basic.forever(function () {
    // Umluftsteuerung
    if (Stundentimer && !(ULüfter)) {
        motors.dualMotorPower(Motor.B, 100)
        ULüfter = 1
        oledssd1306.setTextXY(4, 11)
        oledssd1306.writeString("AN ")
    }
    // Motoransteuerung feuchte
    if (FZig < 68) {
        if (!(MLüfter)) {
            motors.dualMotorPower(Motor.A, 100)
            MLüfter = 1
            oledssd1306.setTextXY(3, 11)
            oledssd1306.writeString("AN ")
        }
        if (!(ULüfter)) {
            motors.dualMotorPower(Motor.B, 100)
            ULüfter = 1
            oledssd1306.setTextXY(4, 11)
            oledssd1306.writeString("AN ")
        }
    }
    if (FZig > 72) {
        motors.dualMotorPower(Motor.A, 0)
        MLüfter = 0
        oledssd1306.setTextXY(3, 11)
        oledssd1306.writeString("AUS")
        if (!(Stundentimer)) {
            motors.dualMotorPower(Motor.B, 0)
            ULüfter = 0
            oledssd1306.setTextXY(4, 11)
            oledssd1306.writeString("AUS")
        }
    }
    // Feuchtemessung und Displayausgabe
    if (Sekundentimer) {
        Sekundentimer = 0
        DHT11.setPin(DigitalPin.C17)
        FZig = DHT11.humidity()
        oledssd1306.setTextXY(2, 10)
        oledssd1306.writeNumber(FZig)
        DHT11.setPin(DigitalPin.C16)
        FMag = DHT11.humidity()
        oledssd1306.setTextXY(0, 10)
        oledssd1306.writeNumber(FMag)
        oledssd1306.setTextXY(6, 0)
        if (FMag < 75) {
            if (!(Blinker)) {
                oledssd1306.writeString("Magazin füllen!")
                Blinker = 1
            } else {
                oledssd1306.clearRange(15)
                Blinker = 0
            }
        } else {
            oledssd1306.clearRange(15)
            Blinker = 0
        }
    }
})
// Entspricht 1 Stunde
// 
loops.everyInterval(5000, function () {
    if (Stundentimer) {
        Stundentimer = 0
    } else {
        Stundentimer = 1
    }
})
