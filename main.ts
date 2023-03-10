function fkt_InitDisplay () {
    oledssd1306.initDisplay()
    oledssd1306.setTextXY(2, 0)
    oledssd1306.writeString("Magazin=     %")
    oledssd1306.setTextXY(3, 0)
    oledssd1306.writeString("Feuchte=     %")
    oledssd1306.setTextXY(5, 0)
    if (!(MLüfter && !(ULüfter))) {
        oledssd1306.writeString(" M=AUS   U=AUS")
    } else {
        if (!(MLüfter && ULüfter)) {
            oledssd1306.writeString(" M=AUS   U=AN ")
        } else {
            if (MLüfter && ULüfter) {
                oledssd1306.writeString(" M=AN    U=AN ")
            } else {
                oledssd1306.writeString(" M=AN    U=AUS")
            }
        }
    }
}
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    fkt_InitDisplay()
})
let Anfeuchten = false
let FMag = 0
let FZig = 0
let SekundentimerMerker = false
let StundentimerMerker = false
let Startzyklus_gelaufen = false
let ULüfter = false
let MLüfter = false
MLüfter = false
ULüfter = false
let Blinker = false
let Sekundentimer = false
let Stundentimer = false
let Anfeuchtzähler = 0
fkt_InitDisplay()
// Entspricht 0.5 Stunde
// 
loops.everyInterval(1800000, function () {
    if (Startzyklus_gelaufen) {
        // Display muss regelmäßig rückgesetzt werden da es sich „Aufhängt“ 
        fkt_InitDisplay()
        music.playTone(262, music.beat(BeatFraction.Whole))
        Stundentimer = !(Stundentimer)
        oledssd1306.setTextXY(0, 0)
        oledssd1306.writeString("Stundentimer:")
        oledssd1306.setTextXY(0, 13)
        if (Stundentimer) {
            oledssd1306.writeNumber(1)
        } else {
            oledssd1306.writeNumber(0)
        }
    }
})
loops.everyInterval(2000, function () {
    Sekundentimer = true
    Blinker = !(Blinker)
})
basic.forever(function () {
    StundentimerMerker = Stundentimer
    SekundentimerMerker = Sekundentimer
    // Blinkende Anzahl von Anfeuchtzyklen als Lebenszeichen
    oledssd1306.setTextXY(6, 7)
    if (Blinker) {
        oledssd1306.writeNumber(Anfeuchtzähler)
    } else {
        oledssd1306.clearRange(15)
    }
    // Feuchtemessung und Displayausgabe alle 2Sekunden
    if (SekundentimerMerker) {
        Sekundentimer = false
        DHT11.setPin(DigitalPin.C17)
        FZig = DHT11.humidity()
        oledssd1306.setTextXY(3, 10)
        oledssd1306.writeNumber(FZig)
        DHT11.setPin(DigitalPin.C16)
        FMag = DHT11.humidity()
        oledssd1306.setTextXY(2, 10)
        oledssd1306.writeNumber(FMag)
        oledssd1306.setTextXY(7, 0)
        // Magazin leer?
        if (FMag < 75) {
            if (Blinker) {
                oledssd1306.writeString("Magazin füllen!")
            } else {
                oledssd1306.clearRange(15)
            }
        } else {
            oledssd1306.clearRange(15)
        }
    }
    // Motoransteuerung Feuchteregelung
    if (FZig <= 69) {
        Anfeuchten = true
        if (!(MLüfter)) {
            Anfeuchtzähler += 1
            motors.dualMotorPower(Motor.A, 100)
            MLüfter = true
            oledssd1306.setTextXY(5, 3)
            oledssd1306.writeString("AN ")
        }
        if (!(ULüfter)) {
            motors.dualMotorPower(Motor.B, 100)
            ULüfter = true
            oledssd1306.setTextXY(5, 11)
            oledssd1306.writeString("AN ")
        }
    }
    if (FZig >= 71) {
        Anfeuchten = false
        motors.dualMotorPower(Motor.A, 0)
        MLüfter = false
        oledssd1306.setTextXY(5, 3)
        oledssd1306.writeString("AUS")
        if (!(StundentimerMerker)) {
            motors.dualMotorPower(Motor.B, 0)
            ULüfter = false
            oledssd1306.setTextXY(5, 11)
            oledssd1306.writeString("AUS")
        }
    }
    // Motoransteuerung Umluft
    if (StundentimerMerker && !(ULüfter)) {
        motors.dualMotorPower(Motor.B, 100)
        ULüfter = true
        oledssd1306.setTextXY(5, 11)
        oledssd1306.writeString("AN ")
    }
    Startzyklus_gelaufen = true
})
