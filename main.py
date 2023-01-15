FMag = 0
FZig = 0
Alt = 0
Alt2 = 0
oledssd1306.init_display()
oledssd1306.set_text_xy(0, 0)
oledssd1306.write_string("Feuchte= ")
oledssd1306.set_text_xy(0, 13)
oledssd1306.write_string("%")
oledssd1306.set_text_xy(2, 0)
oledssd1306.write_string("Magazin= ")
oledssd1306.set_text_xy(2, 13)
oledssd1306.write_string("%")

def on_every_interval():
    global FZig, Alt2, FMag
    DHT11.set_pin(DigitalPin.C16)
    oledssd1306.set_text_xy(0, 10)
    FZig = DHT11.humidity()
    oledssd1306.write_number(FZig)
    DHT11.set_pin(DigitalPin.C17)
    oledssd1306.set_text_xy(2, 10)
    oledssd1306.write_number(FMag)
    if FMag < 80:
        if not (Alt2):
            oledssd1306.set_text_xy(6, 0)
            oledssd1306.write_string("Magazin füllen!")
            Alt2 = 1
        else:
            oledssd1306.set_text_xy(6, 0)
            oledssd1306.clear_range(15)
            Alt2 = 0
    else:
        oledssd1306.set_text_xy(6, 0)
        oledssd1306.clear_range(15)
    FMag = DHT11.humidity()
loops.every_interval(2000, on_every_interval)

def on_forever():
    global Alt
    if FZig < 68:
        if not (Alt):
            motors.dual_motor_power(Motor.AB, 100)
            Alt = 1
    else:
        if FZig > 72:
            motors.dual_motor_power(Motor.AB, 0)
            Alt = 0
basic.forever(on_forever)
