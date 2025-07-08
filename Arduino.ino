
#include <SPI.h>       // Required for SPI communication with MFRC522
#include <MFRC522.h>   // MFRC522 RFID Reader Library

// Define the pins for the RC522 module
// These are common connections for Arduino Uno/Nano.
// If using ESP32/ESP8266, adjust pins according to your board's SPI configuration.
#define SS_PIN 10    // SDA (Slave Select) pin
#define RST_PIN 9    // RST (Reset) pin

MFRC522 mfrc522(SS_PIN, RST_PIN); // Create MFRC522 instance

void setup() {
  Serial.begin(9600);   // Initialize serial communication at 9600 baud rate
  SPI.begin();          // Initialize SPI bus
  mfrc522.PCD_Init();   // Initialize MFRC522 reader

  Serial.println("RFID Reader Initialized. Place a tag on the reader.");
}

void loop() {
  // Look for new cards
  if ( ! mfrc522.PICC_IsNewCardPresent()) {
    return; // No new card present
  }

  // Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial()) {
    return; // Cannot read the serial number (UID)
  }

  // Print UID to Serial Monitor
  Serial.print("RFID Tag Detected! UID: ");
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " "); // Add leading zero for single-digit hex
    Serial.print(mfrc522.uid.uidByte[i], HEX); // Print byte in hexadecimal
  }
  Serial.println();

  // Halt PICC (Passive Integrated Circuit Card) to stop reading until a new card is presented
  mfrc522.PICC_HaltA();
  // Stop encryption on PCD (Proximity Coupling Device)
  mfrc522.PCD_StopCrypto1();

  delay(1000); // Small delay to prevent rapid readings of the same tag
}

/*
   RC522 Wiring Guide (Common for Arduino Uno/Nano):
   ------------------------------------------------
   RC522 Pin     Arduino Pin
   ------------------------------------------------
   RST           9
   SDA (SS)      10
   MOSI          11
   MISO          12
   SCK           13
   VCC           3.3V
   GND           GND
*/
