import { motion as m } from "framer-motion";

function Footer(){
    return (
        <>
        <footer className="footer text-end p-3 text-bg-dark">
            <m.li className="badge bg-dark text-wrap" initial={{opacity:0.6}} whileHover={{ scale: 1.1, opacity:1}}
            onHoverStart={e => {}}
            onHoverEnd={e => {}}
            >Creado por <a href="mailto:fernandezjoaquinok@gmail.com" target="_blank" id="a">Joaquin Fernández.</a></m.li>
        </footer>
        </>
    )
}
export default Footer;