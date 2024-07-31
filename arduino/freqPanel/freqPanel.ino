#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);
void setup() {
  Serial.begin(9600);
  lcd.init();
  lcd.backlight();
  lcd.clear();
}

void loop() {
  if (Serial.available()) {
    lcd.clear();
    lcd.setCursor(0, 0);
    for (int i = 0; i < 13; i++) {
      lcd.write(Serial.read());
    }
    lcd.setCursor(0, 1);
    for (int i = 0; i < 13; i++) {
      lcd.write(Serial.read());
    }
  }
  delay(10);
}
