import { motion as m } from 'framer-motion';
import { useState, useEffect } from 'react';
import codeDisplay from './code';

function Navbar() {
  const [selected, setSelected] = useState(0);
  let tittles = ["Resumen", "Introducción", "Fundamentación", "Objetivos", "Marco Teórico", "Foda", "Esp32", "Realización", "Programación", "Conclusiones" ];
  let href = ["resumen-proyecto", "introduccion-al-proyecto", "fundamentacion", "objetivos", "marco-teorico", "foda", "esp32", "realizacion", "programacion", "conclusiones"];
  const closeNavbar = () => {
    const navbar = document.getElementById("navbar");
    const toggleButton = document.getElementById("navbarToggle");
    const navbarCollapse = document.getElementById("navbarSupportedContent");

    if (navbar && toggleButton && navbarCollapse) {
      navbar.classList.remove("show");
      toggleButton.classList.add("collapsed");
      navbarCollapse.classList.remove("show");
    }
  };

  useEffect(() => {
    const navLinks = document.getElementsByClassName("nav-link");
    for (let i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener("click", closeNavbar);
    }

    return () => {
      for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].removeEventListener("click", closeNavbar);
      }
    };
  }, []);
  
  return (
    <>
      <nav id="navbar" className= "navbar navbar-expand-lg fixed-top bg-body-tertiary" >
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Key Logger</a>
          <button
            id="navbarToggle"
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {tittles.map((item  , index  ) => (
                <li className="nav-item" key={index}>
                  <a
                    href={"#" + href[index]}
                    className={index === selected ? "nav-link active" : "nav-link"}
                    onClick={() => setSelected(index)}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

function Sections() {
  let tittles = ["Resumen", "Introducción", "Fundamentación", "Objetivos", "Marco Teórico", "Foda", "Esp32", "Realización", "Programación", "Conclusiones" ];
  let href = ["resumen-proyecto", "introduccion-al-proyecto", "fundamentacion", "objetivos", "marco-teorico", "foda", "esp32", "realizacion", "programacion", "conclusiones"];
  const resumen = () => {
    return(
        <p>En este proyecto nos centramos en mejorar la tarea de controlar la asistencia de las personas a un establecimiento/empresa, con la ayuda de un identificador de tarjetas por radiofrecuencia. Adjuntado a esto, un sistema de almacenamiento de memoria sobre la hora de llegada y presencia de las personas en el lugar.
        </p>
    );
}
const introduccion = () => {
    return(
      <p> El proyecto que creamos consta de una serie de componentes encargados de almacenar datos, para posteriormente acceder a ellos y utilizarlos para generar automáticamente una tabla de asistencias. Dentro de la misma se hayan: <br /><br />
      <strong>Estado</strong> (si está en la escuela o no),<strong> fecha y hora</strong>,<strong> UID</strong> (A futuro, pensamos agregar nombre y apellido).<br />
      </p>
    );
}
const marcoTeorico = () => {
  return (
      <>
          <p>
              <strong>Botón:</strong><br />
              - Función: Permite apagar, encender o modificar el funcionamiento de una máquina o sistema.<br />
              - Características: Integra un chip de comunicación de lectura y escritura sin contacto a 13.56MHz y maneja tramas según el estándar ISO14443A.
          </p>
          <p>
              <strong>Tarjeta RFID:</strong><br />
              - Función: Sistema de almacenamiento y recuperación de datos remoto que utiliza dispositivos como etiquetas, tarjetas, transpondedores o tags RFID.
          </p>
          <p>
              <strong>Protoboard:</strong><br />
              - Función: Se utiliza en proyectos de robótica para conectar componentes electrónicos sin necesidad de soldaduras.
          </p>
          <p>
              <strong>Cables:</strong><br />
              - Función: Se utilizan cables macho-macho y hembra-macho de Arduino para realizar conexiones necesarias.
          </p>
          <p>
              <strong>Transformador 5V:</strong><br />
              - Función: Se utiliza en circuitos eléctricos para cambiar el voltaje de la electricidad en el circuito.
          </p>
          <p>
              <strong>Buzzer:</strong><br />
              - Función: Transductor electroacústico que produce un sonido continuo o intermitente de un mismo tono. Se utiliza como mecanismo de señalización o aviso en diversos sistemas.
          </p>
          <p>
              <strong>Display LCD:</strong><br />
              - Función: Dispositivo de salida común en proyectos con microcontroladores como Arduino. Permite mostrar texto y números en una disposición de dos líneas de texto de 16 caracteres cada una.
          </p>
          <p>
              <strong>Lector SD:</strong><br />
              - Función: Se encarga de la comunicación con el almacenamiento de la tarjeta SD. Permite leer y escribir datos en el almacenamiento, que luego pueden ser transformados a formato Excel u otro.
          </p>
          <p>
              <strong>Capacitor:</strong><br />
              - Función: Componente que almacena carga eléctrica y puede cargar y descargarse rápidamente. Generalmente, tiene una capacidad de retención de energía mucho menor que una batería.
          </p>
          <p>
              <strong>Rtc ds1302:</strong><br />
              - Función: Pequeño dispositivo utilizado para llevar un registro preciso del tiempo en sistemas electrónicos.
          </p>
          <p>
              <strong>Módulo SD:</strong><br />
              - Función: Contiene una tarjeta SD que puede almacenar datos, como registros de usuarios que entran o salen.
          </p>
      </>
  );
}
const fundamentación = () => {
    return(
        <>
        <p>Cada año que pasa, en las escuelas técnicas Argentinas, se realiza un proyecto anual (relacionado a la modalidad cursada), y al finalizarlo se defenderá oralmente en la evaluación de saberes. Este año tuvimos la idea de crear un sistema de control de asistencia.</p>
        </>
    );
    }
const objetivos = () => {
    return(
        <>
        <p>Lograr reducir, alivianar y aligerar el trabajo de nuestras preceptoras, con el propósito de optimizar las tareas administrativas.</p>
        </>
    );
    }   
const esp32Info = () => {
    return (
      <>
      <p>
      <strong>ESP32 Doit Devkit V1:</strong><br />
     El ESP32 Doit Devkit V1 es un microcontrolador de desarrollo altamente versátil basado en el chip ESP32 de Espressif Systems. Este chip es conocido por su potencia y versatilidad en aplicaciones IoT (Internet de las Cosas) y proyectos de electrónica.
    </p>
              <p>
                  <strong>Características Principales:</strong><br />
                  - Microcontrolador de doble núcleo basado en el chip ESP32.<br />
                  - Conectividad Wi-Fi y Bluetooth integrada.<br />
                  - Soporte para programación en lenguaje C/C++ utilizando el entorno de desarrollo Arduino IDE.<br />
                  - Amplia gama de pines de entrada/salida para la conexión de sensores y actuadores.<br />
                  - Interfaz USB para alimentación y programación.<br />
                  - Capacidad para ejecutar aplicaciones en tiempo real y aplicaciones en segundo plano.
              </p>
              <p>
                  <strong>Entradas y Salidas:</strong><br />
                  - <em>Pines GPIO:</em> El ESP32 Doit Devkit V1 cuenta con numerosos pines GPIO que pueden configurarse como entradas o salidas digitales. Estos pines son versátiles y se pueden utilizar para conectar sensores, LEDs, relés y otros dispositivos.<br />
                  - <em>Puertos Analógicos:</em> Ofrece pines analógicos que permiten la lectura de señales analógicas, como sensores de temperatura o potenciómetros.<br />
                  - <em>Interfaz UART, SPI y I2C:</em> Proporciona interfaces de comunicación UART, SPI e I2C para conectar periféricos y sensores externos.<br />
                  - <em>Conexión Wi-Fi y Bluetooth:</em> Integra módulos Wi-Fi y Bluetooth que permiten la comunicación inalámbrica con otros dispositivos y la conexión a redes Wi-Fi.<br />
                  - <em>Puertos de Alimentación:</em> Incluye pines de alimentación para conectar una fuente de energía y suministrar energía al ESP32.<br />
                  - <em>USB:</em> Tiene un puerto USB que se utiliza para cargar el firmware y establecer una conexión serial con la computadora.
              </p>
              <p>
                  <strong>Aplicaciones:</strong><br />
                  El ESP32 Doit Devkit V1 es ampliamente utilizado en proyectos de IoT, automatización del hogar, robótica y muchas otras aplicaciones donde se requiere conectividad inalámbrica y un alto grado de flexibilidad en la programación y el control de dispositivos.
              </p>
          </>
      );
  }
const realizacion = () => {
    return(
        <>
        
        <strong>Dividimos las tareas en tres grupos: </strong><br />
        - <em>Programación y emsamblaje:</em> Se encargó del código de arduino y cómo hacer funcionar cada componente con la respectiva placa.<br />
        - <em>Informe:</em> Este grupo se encargó de elaborar la carpeta con toda la información sobre el proyecto.<br />
        - <em>Diseño:</em> Se encargaron de elegir los materiales para su carcasa y diseñar la apariencia de este proyecto.<br />
        
        </>
    );
}
const conclusiones = () => {
  return(
    <>
    <p>
    Con este proyecto nos metimos de lleno en el mundo de Arduino y similares, permitiéndonos el manejo y control de diversos componentes electrónicos para concretar nuestro proyecto. <br />
    En este proyecto pudimos perfeccionar nuestras habilidades y conocimientos en cuanto a sensores RFID, RTC, y pantalla LCD. <br />
    Todo esto sumado al trabajo en equipo, la comunicación, y la adquisición de experiencia en desarrollo de programación para resolver distintas problemáticas presentadas como desafío en nuestro proyecto. <br />

    </p>
    </>
  );
}
const foda = () => {
  return(
    <>
    
        <strong>Fortalezas: </strong><br />Con este proyecto ya no será necesario el control de personal de asistencias ya que estará automatizado.<br /><br />
        <strong>Oportunidades: </strong> <br />Nos brinda la posibilidad de llevar un control más seguro de asistencias y a su vez ahorrar tiempo.<br /><br />
        <strong>Debilidades: </strong> <br />Existen muchos de estos mismos en diversos lugares y de distintos modelos.<br /><br />
        <strong>Amenazas: </strong> <br />La desconfiguración de la programación por el paso del tiempo.<br /><br />
    
    </>
  );
}
const aH1 = (texto:String) => {
  return(
      <m.h1
      initial={{opacity:0.6}} whileHover={{ scale: 1.2, opacity:1}}
      onHoverStart={e => {}}
      onHoverEnd={e => {}}>
      {texto}
      </m.h1>
  )
}
const aP = (texto:String) => {
  return(
      <m.p
      initial={{opacity:0.6}} whileHover={{ scale: 1.2, opacity:1}}
      onHoverStart={e => {}}
      onHoverEnd={e => {}}>
      {texto}<br />
      </m.p>
  )
}
const aStrong = (texto:String) => {
  return(
      <m.strong
      initial={{opacity:0.6}} whileHover={{ scale: 1.2, opacity:1}}
      onHoverStart={e => {}}
      onHoverEnd={e => {}}>
      {texto}<br />
      </m.strong>
  )
}

  const content = [resumen(), introduccion(), fundamentación(), objetivos(), marcoTeorico(), foda(), esp32Info(), realizacion(), codeDisplay(), conclusiones()];
  return (
    <>
  
      <m.article className="article bg-body-tertiary" id='quienes-somos'>
        {aH1("E.E.S.T. N°2")}
        {aH1("6to 3ra")}
        {aStrong("Modalidad:")}
        {aP("Electrónica")}
        {aStrong("Alumnos:")}
        {aP("Gomez Lisandro")}
        {aP("Carranza Agustina")}
        {aP("Fernández Joaquin")}
        {aP("Jara Francisco")}
        {aP("Porette Bautista")}
        {aStrong("Profesores:")}
        {aP("Nicolás Arcieri ")}
        {aP("Mauro González")}
        {aP("Martin Trisi")}
      </m.article>
      {tittles.map((tittle, index) => (
        <m.article className="article bg-body-tertiary" key={index} id={href[index]}>
          <aside>
            <h1>{tittle}</h1>
          </aside>
          <p>{content[index]}</p>
        </m.article>
      ))}
    </>
  );
}

export { Navbar, Sections };
