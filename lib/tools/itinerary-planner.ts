/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { FunctionCall } from '../state';
import { FunctionResponseScheduling } from '@google/genai';

export const itineraryPlannerTools: FunctionCall[] = [
  {
    name: 'mapsGrounding',
    description: `
    Una herramienta versátil que aprovecha los datos de Google Maps para generar información contextual y contenido creativo sobre lugares. Se puede utilizar para dos propósitos principales:

    1.  **Para la planificación de itinerarios:** Encuentra y resume información sobre lugares como restaurantes, museos o parques. Utiliza una consulta directa para obtener resúmenes fácticos de los mejores resultados.
        -   **Ejemplo de consulta:** "museos divertidos en París" o "la mejor pizza en Brooklyn".

    2.  **Para contenido creativo:** Genera narrativas atractivas, acertijos o pistas de búsqueda del tesoro basadas en datos de ubicación del mundo real. Utiliza una consulta descriptiva combinada con un 'systemInstruction' personalizado para guiar el resultado creativo.
        -   **Ejemplo de consulta:** "un famoso restaurante histórico en París".

    Argumentos:
        query: Una cadena que describe los parámetros de búsqueda. **DEBES ser lo más preciso posible**, incluye tantos datos de ubicación como puedas, como ciudad, estado y/o país para reducir resultados ambiguos.
        markerBehavior: (Opcional) Controla los marcadores del mapa. "mentioned" (predeterminado), "all" o "none".
        systemInstruction: (Opcional) Una cadena que proporciona una personalidad e instrucciones para el resultado de la herramienta. Úsala para tareas creativas para asegurar que la respuesta esté formateada como una pista, acertijo, etc.
        enableWidget: (Opcional) Un booleano para controlar si el widget de mapas interactivo está habilitado para la respuesta. El valor predeterminado es verdadero. Establécelo en falso para respuestas de solo texto o cuando la interfaz de usuario no pueda admitir el widget.

    Devuelve:
        Una respuesta del agente de "grounding" de mapas. El contenido y el tono de la respuesta se moldearán según la consulta y el 'systemInstruction' opcional.
    `,
    parameters: {
      type: 'OBJECT',
      properties: {
        query: {
          type: 'STRING',
        },
        markerBehavior: {
          type: 'STRING',
          description:
            'Controla qué resultados obtienen marcadores. "mentioned" para lugares en la respuesta de texto, "all" para todos los resultados de búsqueda, o "none" para ningún marcador.',
          enum: ['mentioned', 'all', 'none'],
        },
        systemInstruction: {
          type: 'STRING',
          description:
            "Una cadena que proporciona una personalidad e instrucciones para el resultado de la herramienta. Úsala para tareas creativas para asegurar que la respuesta esté formateada como una pista, acertijo, etc.",
        },
        enableWidget: {
          type: 'BOOLEAN',
          description:
            'Un booleano para controlar si el widget de mapas interactivo está habilitado para la respuesta. El valor predeterminado es verdadero. Establécelo en falso para respuestas de solo texto o cuando la interfaz de usuario no pueda admitir el widget.',
        },
      },
      required: ['query'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'frameEstablishingShot',
    description: 'Llama a esta función para mostrar una ciudad o ubicación en el mapa. Proporciona un nombre de ubicación para geocodificar o una latitud y longitud específicas. Esto proporciona una vista amplia y de establecimiento del área.',
    parameters: {
      type: 'OBJECT',
      properties: {
        geocode: {
          type: 'STRING',
          description: 'El nombre de la ubicación a buscar (por ejemplo, "París, Francia"). **DEBES ser lo más preciso posible**, incluye tantos datos de ubicación como puedas, como ciudad, estado y/o país para reducir resultados ambiguos.'
        },
        lat: {
          type: 'NUMBER',
          description: 'La latitud de la ubicación.'
        },
        lng: {
          type: 'NUMBER',
          description: 'La longitud de la ubicación.'
        },
      },
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'frameLocations',
    description: 'Encuadra múltiples ubicaciones en el mapa, asegurando que todas sean visibles. Proporciona una matriz de nombres de ubicación para geocodificar o una matriz de puntos específicos de latitud/longitud. Opcionalmente, puede agregar marcadores para estas ubicaciones. Al depender de la geocodificación, **DEBES ser lo más preciso posible**, incluye tantos datos de ubicación como puedas, como ciudad, estado y/o país para reducir resultados ambiguos.',
    parameters: {
      type: 'OBJECT',
      properties: {
        locations: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              lat: { type: 'NUMBER' },
              lng: { type: 'NUMBER' },
            },
            required: ['lat', 'lng'],
          },
        },
        geocode: {
          type: 'ARRAY',
          description: 'Una matriz de nombres de ubicación para buscar (por ejemplo, ["Torre Eiffel", "Museo del Louvre"]).',
          items: {
            type: 'STRING',
          },
        },
        markers: {
          type: 'BOOLEAN',
          description: 'Si es verdadero, agrega marcadores al mapa para cada ubicación que se está encuadrando.'
        }
      },
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
];
