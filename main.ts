let Anfeuchten = false
let FMag = 0
let FZig = 0
let Stundenzähler = 0
let MLüfter = 0
let ULüfter = 0
let Blinker = 0
let Sekundentimer = 0
let Stundentimer = false
let Stundentimermerker = 0
let Tageszähler = 1
let AnzahlAnfeuchten = 0
let Anfeuchtzähler = 0
oledssd1306.initDisplay()
oledssd1306.setTextXY(2, 0)
oledssd1306.writeString("Magazin=     %")
oledssd1306.setTextXY(3, 0)
oledssd1306.writeString("Feuchte=     %")
oledssd1306.setTextXY(5, 0)
oledssd1306.writeString(" M=AUS   U=AUS")
// Entspricht 0,5 0,5 0.5 Stunde
// 
loops.everyInterval(1800000, function () {
    Stundentimer = !(Stundentimer)
    Stundenzähler += 1
    if (Stundenzähler > 48) {
        Stundenzähler = 0
        Tageszähler += 1
        AnzahlAnfeuchten = Anfeuchtzähler / Tageszähler
    }
})
loops.everyInterval(2000, function () {
    Sekundentimer = 1
})
// Motoransteuerung
basic.forever(function () {
    oledssd1306.setTextXY(0, 0)
    oledssd1306.writeNumber(Anfeuchtzähler)
    // Feuchtemessung und Displayausgabe
    if (Sekundentimer) {
        Sekundentimer = 0
        DHT11.setPin(DigitalPin.C17)
        FZig = DHT11.humidity()
        oledssd1306.setTextXY(3, 10)
        oledssd1306.writeNumber(FZig)
        DHT11.setPin(DigitalPin.C16)
        FMag = DHT11.humidity()
        oledssd1306.setTextXY(2, 10)
        oledssd1306.writeNumber(FMag)
        oledssd1306.setTextXY(7, 0)
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
    // Motoransteuerung feuchte
    if (FZig < 68) {
        Anfeuchten = true
        if (!(MLüfter)) {
            Anfeuchtzähler += 1
            motors.dualMotorPower(Motor.A, 100)
            MLüfter = 1
            oledssd1306.setTextXY(5, 3)
            oledssd1306.writeString("AN ")
        }
        if (!(ULüfter)) {
            motors.dualMotorPower(Motor.B, 100)
            ULüfter = 1
            oledssd1306.setTextXY(5, 11)
            oledssd1306.writeString("AN ")
        }
    }
    if (FZig > 72) {
        Anfeuchten = false
        motors.dualMotorPower(Motor.A, 0)
        MLüfter = 0
        oledssd1306.setTextXY(5, 3)
        oledssd1306.writeString("AUS")
        if (!(Stundentimer)) {
            motors.dualMotorPower(Motor.B, 0)
            ULüfter = 0
            oledssd1306.setTextXY(5, 11)
            oledssd1306.writeString("AUS")
        }
    }
    // Umluftsteuerung
    if (Stundentimer && !(ULüfter)) {
        motors.dualMotorPower(Motor.B, 100)
        ULüfter = 1
        oledssd1306.setTextXY(5, 11)
        oledssd1306.writeString("AN ")
    }
})
