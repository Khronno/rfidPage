import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { obsidian } from 'react-syntax-highlighter/dist/esm/styles/hljs';


const codeDisplay = () => {
  const code = `
  // Declaracion de librerias
  #include SPI.h
  #include MFRC522.h
  #include Wire.h
  #include ThreeWire.h
  #include RtcDS1302.h
  #include LiquidCrystal_I2C.h
  #include SD.h

  // Declaración de pines
  #define RFID_RST 15      // Pin RST del módulo RC522
  #define RFID_SDA 5       // Pin SDA del módulo RC522
  #define BUZZER_PIN 27    // Pin para el buzzer
  #define SD_PIN 26
  #define BUTTON_PIN 4
  #define RTC_CLK 14
  #define RTC_DAT 12
  #define RTC_RST 13

  // Variables globales
  byte valueButton = 1;
  int year, lengthU, toRun;
  byte stateButton = 0;
  unsigned long tx = 0;
  bool cardRead = false;
  String cardValue;
  char uidBuffer[4];
  String copy = "";

  // Objetos para componentes
  LiquidCrystal_I2C lcd(0x27, 16, 2);
  MFRC522 mfrc522(RFID_SDA, RFID_RST);
  ThreeWire myWire(RTC_DAT, RTC_CLK, RTC_RST);// DAT, CLK, RST
  RtcDS1302<ThreeWire> Rtc(myWire);

  // Archivos
  File usuarios, registro, entraron, file;
  String fileF = "/FILE.TXT";
  String entraronF = "/ENTRARON.TXT";
  String usuariosF = "/USUARIOS.TXT";
  String registroF = "/REGISTRO.TXT";

  void setup() {
    // Inicializacion de los pines y configuracion general
    Serial.begin(9600);//Iniciar comunicación para debug, y datos menores
    while (!Serial);
    pinMode(SD_PIN, OUTPUT);
    digitalWrite(SD_PIN, HIGH);
    Rtc.Begin();
    pinMode(BUZZER_PIN, OUTPUT);
    pinMode(BUTTON_PIN, INPUT_PULLUP);
    lcd.begin();
    lcd.backlight();//lcd prendida
    //Configuración para RTC
    //RtcDateTime currentTime = RtcDateTime(__DATE__ , __TIME__);
    //Rtc.SetDateTime(currentTime);

    SPI.begin();//comunicacion SPI iniciada
    mfrc522.PCD_Init();//inicia el mrc522

    // Inicializar la tarjeta SD
    if (!SD.begin(SD_PIN)) {
      Serial.println(F("Error iniciando tarjeta SD."));
      displayMessage(F("Error iniciando"), F("tarjeta SD"));
      while(1){}
    }
    Serial.println(F("Tarjeta SD iniciada correctamente."));

    mfrc522.PCD_DumpVersionToSerial();

    initializeFile(usuariosF);
    initializeFile(registroF);
    initializeFile(entraronF);
  }

  void loop() {
    registerButton();
    displayClock();
    mainProcess();
  }

  void displayClock() {
    // Obtener la fecha y hora actual del RTC
    RtcDateTime now = Rtc.GetDateTime();

    delay(100);

    // Mostrar "Colocar tarjeta" en la primera línea del LCD
    lcd.setCursor(0, 0);
    lcd.print("Colocar tarjeta");

    // Mostrar la fecha y hora en la segunda línea del LCD
    lcd.setCursor(0, 1);
    printDoubleDigit(now.Day());
    lcd.print("/");
    printDoubleDigit(now.Month());
    lcd.print("/");
    lcd.print(now.Year());
    lcd.print("|");
    printDoubleDigit(now.Hour());
    lcd.print(":");
    printDoubleDigit(now.Minute());
  }

  // Función para imprimir un número de dos dígitos, si es menor a 10 se agrega un 0 delante
  void printDoubleDigit(int number) {
    if (number < 10) {
      lcd.print("0");
    }
    lcd.print(number);
  }

  // Certificación de el estado de los archivos
  void initializeFile(String filename) {
    if (!SD.exists(filename)) {
      File file = SD.open(filename, FILE_WRITE);
      if (file) {
        file.close();
        Serial.print(filename);
        Serial.println(F(" ha sido creado"));
      } else {
        Serial.print(F("Error al crear "));
        Serial.println(filename);
      }
    } else {
      Serial.print(filename);
      Serial.println(F(" ya existe"));
    }
  } 

  void mainProcess() {
      // Verificar si hay una nueva tarjeta presente en el lector
      if (!mfrc522.PICC_IsNewCardPresent()) {
        return;
      }
    
      // Leer el serial de la tarjeta
      if (!mfrc522.PICC_ReadCardSerial()) {
        return;
      }
    
      // Inicializar la variable cardValue para almacenar el UID
      cardValue = "";
    
      // Leer el UID de la tarjeta y almacenarlo en cardValue
      for (byte i = 0; i < mfrc522.uid.size; i++) {
        // Formatear el valor hexadecimal y almacenarlo en el búfer
        sprintf(uidBuffer, "%02X", mfrc522.uid.uidByte[i]);
        // Concatenar el valor del búfer en la variable cardValue
        cardValue += uidBuffer;
      }
    
      // Imprimir el valor del UID en el Serial Plotter
      serialP(cardValue);
    
      // Verificar si la tarjeta está registrada
      if (ifIsRegister(cardValue)) {
        // Mostrar mensajes en la pantalla y hacer sonidos apropiados
        entryRegis(cardValue, ifIsAlreadyIn(cardValue));
      } else {
        // Mostrar mensajes en la pantalla y hacer sonidos apropiados
        lcd.noDisplay();
        lcd.clear();
        delay(100);
        lcd.display();
        displayMessage(F("No registrado"), F(""));
        buzzerTone(250, 1000, 0);
        lcd.noDisplay();
        lcd.clear();
        lcd.display();
        displayMessage(F("Para registrarte"), F("Apreta el boton"));
        delay(1000);
        lcd.noDisplay();
        lcd.clear();
        delay(100);
        lcd.display();
        displayClock();
      }
    
      // Limpiar el valor de la tarjeta para la siguiente lectura
      cardValue = "";
      mfrc522.PICC_HaltA(); // Finalizar la comunicación con la tarjeta
    }
    
    void registerButton() {
      valueButton = digitalRead(BUTTON_PIN); // Leer si el botón está pulsado
      
      // Si el botón está presionado
      if (valueButton == LOW) {
        stateButton = 1;
        cardRead = false;
        
        // Mostrar mensaje en la pantalla para colocar la tarjeta
        displayMessage(F("Colocar tarjeta"), F("Para registrarse"));
        
        tx = millis(); // Guardar el tiempo actual en 'tx'
    
        // Esperar hasta que se cumpla el tiempo de registro o se lea una tarjeta
        while (millis() - tx < 10000) {
          toRegis();
          
          // Si se leyó una tarjeta, actualizar la hora en la pantalla y salir del bucle
          if (cardRead == true) {
            displayClock();
            break;
          }
        }
      }
    }
    
    void toRegis() {
      if (cardRead) {
        return;
      }
    
      // Verificar si hay una nueva tarjeta presente en el lector
      if (!mfrc522.PICC_IsNewCardPresent()) {
        return;
      }
    
      // Leer el serial de la tarjeta
      if (!mfrc522.PICC_ReadCardSerial()) {
        return;
      }
    
      // Inicializar la variable cardValue para almacenar el UID
      cardValue = "";
    
      // Leer el UID de la tarjeta y almacenarlo en cardValue
      for (byte i = 0; i < mfrc522.uid.size; i++) {
        // Formatear el valor hexadecimal y almacenarlo en el búfer
        sprintf(uidBuffer, "%02X", mfrc522.uid.uidByte[i]);
        // Concatenar el valor del búfer en la variable cardValue
        cardValue += uidBuffer;
      }
    
      // Imprimir el valor del UID en el Serial Plotter
      serialP(cardValue);
    
      // Verificar si la tarjeta está registrada
      if (ifIsRegister(cardValue)) {
        displayMessage(F("Ya estas"), F("registrado"));
        delay(1000);
        displayMessage(F("Intentalo"), F("nuevamente"));
        buzzerTone(250, 250, 0);
        cardRead = false;
        displayClock();
        return; // Salir de la función si la tarjeta ya está registrada
      }
      
      // Mostrar mensaje en la pantalla y reproduce un tono
      displayMessage(F("Registrando"), F(""));
      delay(600);
      toRegister(cardValue);
      displayMessage(F("Has sido"), F("registrado"));
      buzzerTone(500, 1000, 1);
      cardRead = true;
      cardValue = "";
    }
    //Función personalizada para hacer ruidos
    void buzzerTone(int t1, int t2, int mode){
      digitalWrite(BUZZER_PIN, HIGH);
      delay(t1);
      digitalWrite(BUZZER_PIN, LOW);
      
      if (mode == 0) {
        delay(t1);
        digitalWrite(BUZZER_PIN, HIGH);
        delay(t1);
        digitalWrite(BUZZER_PIN, LOW);
      }
      
      delay(t2);
    }
    //desplegar un mensaje de 2 lineas en pantalla, con opcion de usarlo con la flash
    void displayMessage(const __FlashStringHelper* line1, const __FlashStringHelper* line2) {
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print(line1);
      lcd.setCursor(0, 1);
      lcd.print(line2);
    }
    //funcion que registra a los usuarios
    void toRegister(String uid) {
      File usuarios = SD.open(usuariosF, FILE_WRITE); // Abrir en modo escritura
      if (usuarios) {
        usuarios.seek(usuarios.size()); // Mover el puntero al final del archivo
        usuarios.print(uid); // Escribir el nuevo UID
        usuarios.print(",");
        usuarios.flush(); // Asegurarse de que los datos se escriban
        usuarios.close(); // Cerrar el archivo
        Serial.println(F("Datos escritos en el archivo correctamente."));
      } else {
        Serial.println(F("Error al abrir el archivo para escritura."));
      }
    }
    //funcion que certifica si un usuario está registrada
    bool ifIsRegister(String user) {
      // Abre el archivo en modo lectura
      usuarios = SD.open(usuariosF, FILE_READ);
      delay(100);
      
      if (usuarios) {
        String verifyUser;
        char nextCharacter;
    
        while (usuarios.available()) {
          nextCharacter = usuarios.read();
          if (nextCharacter == ',') {
            if (verifyUser == user) {
              usuarios.close();
              return true;
            }
            verifyUser = ""; // Limpiar la cadena para el siguiente UID
          } else {
            verifyUser += nextCharacter; // Agregar el caracter leído al UID temporal
          }
        }
        
        // Verificar el último UID al final del archivo
        if (verifyUser == user) {
          usuarios.flush();
          usuarios.close();
          return true;
        }
        usuarios.flush();
        usuarios.close();
      }
      displayClock();
      return false; // El archivo no se pudo abrir o el usuario no está registrado
    }
    //Imprime en el serial monitor
    void serialP(String message){
      Serial.println(message);
    }
    //registra las entradas y salidas de aquellos registrados guarda la fecha, el uid, y si salió o entró a la escuela
    void entryRegis(String uid, String state) {
      RtcDateTime now = Rtc.GetDateTime();
      String completeTime = String(now.Hour()) + ":" + String(now.Minute()) + " " + String(now.Day()) + "|" + String(now.Month()) + "|" + String(now.Year());
      Serial.println(completeTime);
      registro = SD.open(registroF, FILE_WRITE); // Abre el archivo en modo escritura
      delay(50);
      
      if (registro) {
        registro.seek(registro.size());
        registro.print(uid); // Escribe el UID en el archivo
        registro.print(" ");
        registro.print(state);
        registro.print(" ");
        registro.print(completeTime); // Agrega la fecha y hora al registro
        registro.print(","); // Agrega una coma para separar los UID
        registro.flush(); // Verificar que ningún dato quedó a medio camino
        registro.close(); // Cierra el archivo después de escribirlo
        Serial.println(F("Datos escritos en el archivo correctamente."));
        displayClock();
      } else {
        Serial.println(F("Error al abrir el archivo para escritura."));
        displayClock();
      }
    }
    //se fija si un usuario estaba previamente en la escuela, si ya estaba muestra un mensaje y lo elimina del archivo, si este no estaba en el archivo se escribe
    String ifIsAlreadyIn(String user) {
      entraron = SD.open(entraronF, FILE_READ); // Abre el archivo en modo lectura
      delay(50);
      if (entraron) {
        String verifyUser;
        char nextCharacter;
        lengthU = user.length() + 1; // Agregar 1 para contar la coma también
        int startPos = -1; // Posición inicial del usuario en el archivo
        int endPos = -1; // Posición final del usuario en el archivo
        int pos = 0; // Posición actual en el archivo
    
        while (entraron.available()) {
          nextCharacter = entraron.read();
    
          if (nextCharacter == ',' || nextCharacter == '\n') {
            if (verifyUser == user) {
              endPos = pos; // Actualizar la posición final
              break; // Salir del bucle si se encuentra el usuario
            }
            verifyUser = ""; // Limpiar la cadena para el siguiente UID
            startPos = -1; // Reiniciar la posición inicial
          } else {
            if (startPos == -1) {
              startPos = pos; // Guardar la posición inicial
            }
            verifyUser += nextCharacter; // Agregar el caracter leído al UID temporal
          }
    
          pos++;
        }
    
        if (endPos != -1) {
          removeText(startPos, (endPos + 1)); // Eliminar el usuario del archivo
          displayMessage(F("Hasta luego,"), F("nos vemos!!"));
          buzzerTone(350, 750, 0);
          return "Entró";
        } 
        if(endPos == -1) {
          addUser(cardValue); // Agregar el usuario si no se encontró en el archivo
          displayMessage(F("Bienvenido!!"), F("de vuelta"));
          buzzerTone(500, 1000, 1);
          return "Salió";
        }
        entraron.flush();
        entraron.close();
      }
      displayClock();
    }
    //remueve un texto desde una posicion inicial hasta una final, teniendo en cuenta el largo del string y sumandole uno para quitar la coma
    void removeText(int start, int length) {
      File entraron = SD.open(entraronF, FILE_READ); // Abrir archivo en modo lectura
      if (!entraron) {
        Serial.println(F("Error al abrir el archivo."));
        return;
      }
    
      String updatedContent = "";
      char character;
      int pos = 0;
    
      while (entraron.available()) {
        character = entraron.read();
        if (pos < start || pos >= (start + length)) {
          updatedContent += character;
        }
        pos++;
      }
    
      entraron.close();
    
      file = SD.open(entraronF, FILE_WRITE); // Abrir archivo en modo escritura
      if (!file) {
        Serial.println(F("Error al abrir el archivo para escritura."));
        return;
      }
    
      file.print(updatedContent);
      file.close();
    
      Serial.println(F("Usuario eliminado"));
      displayClock();
    }
    //Agrega un usuario en entraron para ver si entró a la escuela o salió
    void addUser(String user){
      entraron = SD.open(entraronF, FILE_WRITE); // Abre el archivo en modo escribir
      entraron.seek(entraron.size());
      delay(100);
      entraron.print(user);
      entraron.print(",");
      entraron.flush();
      entraron.close();
      Serial.println(user);
      Serial.print(F("Usuario añadido"));
      displayClock();
      }
  `;
  

    const [isCollapsed, setIsCollapsed] = useState(true);
  
    const toggleCollapsible = () => {
      setIsCollapsed(!isCollapsed);
    };
  
    return (
      <div >
        <p>La parte más difícil fue poder desde cero llegar a conectar todos los componentes y que trabajen en armonía. Para ello tuvimos que investigar a fondo sobre el lenguaje Arduino, en donde aprendimos librerías y especialmente la manera de optimizar al máximo posible el programa para así reducir los riegos de perdida de datos, etc.</p>
        <span className="badge bg-warning-subtle border border-warning-subtle text-warning-emphasis rounded-pill">Son 459 líneas de código, si no desea verlo recomiendo no presionar el botón.</span><br /><br />
        <button onClick={toggleCollapsible} id='bg-body-tertiary' className='acordion'>
          {isCollapsed ? ">" : "<"} 
        </button>
        
        {!isCollapsed && (
          <SyntaxHighlighter language="cpp" style={obsidian} showLineNumbers>
            {code}
          </SyntaxHighlighter>
        )}
        </div>
    );
}
  


export default codeDisplay;
            
          