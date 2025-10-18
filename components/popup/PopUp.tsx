/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// FIX: Added FC to the React import.
import React, { FC } from 'react';
import './PopUp.css';

interface PopUpProps {
  onClose: () => void;
}

const PopUp: React.FC<PopUpProps> = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Bienvenido al Planificador de Día Interactivo</h2>
        <div className="popup-scrollable-content">
          <p>
            Esta demostración interactiva destaca la capacidad de Gemini y Grounding con Google Maps para mantener conversaciones en tiempo real mediante la voz.
            Planifica una excursión de un día usando lenguaje natural y experimenta cómo Gemini utiliza Google Maps para ofrecer información precisa y actualizada.
          </p>
          <p>Para empezar:</p>
          <ol>
            <li>
              <span className="icon">play_circle</span>
              <div>Presiona el botón <strong>&nbsp; Play &nbsp;</strong> para iniciar la conversación.</div>
            </li>
            <li>
              <span className="icon">record_voice_over</span>
              <div><strong>Habla con naturalidad &nbsp;</strong>para planificar tu viaje. Intenta decir:
              "Vamos a planificar un viaje a Santa Marta."</div>
            </li>
            <li>
              <span className="icon">map</span>
              <div>Observa cómo el mapa se <strong>&nbsp; actualiza dinámicamente &nbsp;</strong> con
              las ubicaciones de tu itinerario.</div>
            </li>
            <li>
              <span className="icon">keyboard</span>
              <div>Alternativamente, <strong>&nbsp; escribe tus solicitudes &nbsp;</strong> en el
              cuadro de mensaje.</div>
            </li>
            <li>
              <span className="icon">tune</span>
              <div>Haz clic en el ícono de <strong>&nbsp; Configuración &nbsp;</strong> para personalizar la
              voz y el comportamiento de la IA.</div>
            </li>
          </ol>
        </div>
        <button onClick={onClose}>¡Entendido, a planificar!</button>
      </div>
    </div>
  );
};

export default PopUp;
