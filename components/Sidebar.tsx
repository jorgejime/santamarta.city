/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
// FIX: Added missing React imports.
import React, { useEffect, useMemo } from 'react';
import { useSettings, useUI, useLogStore, useTools, personas } from '@/lib/state';
import c from 'classnames';
import {
  AVAILABLE_VOICES_SPANISH,
  DEFAULT_VOICE,
} from '@/lib/constants';
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';

const AVAILABLE_MODELS = [
  'gemini-2.5-flash-native-audio-preview-09-2025',
  'gemini-2.5-flash-preview-native-audio-dialog',
  'gemini-2.5-flash-exp-native-audio-thinking-dialog',
  'gemini-live-2.5-flash-preview',
  'gemini-2.0-flash-live-001'
];

export default function Sidebar() {
  const {
    isSidebarOpen,
    toggleSidebar,
    showSystemMessages,
    toggleShowSystemMessages,
  } = useUI();
  const {
    systemPrompt,
    model,
    voice,
    setSystemPrompt,
    setModel,
    setVoice,
    isEasterEggMode,
    activePersona,
    setPersona,
  } = useSettings();
  const { connected } = useLiveAPIContext();

  const availableVoices = AVAILABLE_VOICES_SPANISH;

  useEffect(() => {
    if (!availableVoices.some(v => v.name === voice)) {
      setVoice(DEFAULT_VOICE);
    }
  }, [availableVoices, voice, setVoice]);

  const handleExportLogs = () => {
    const { systemPrompt, model } = useSettings.getState();
    const { tools } = useTools.getState();
    const { turns } = useLogStore.getState();

    const logData = {
      configuration: {
        model,
        systemPrompt,
      },
      tools,
      conversation: turns.map(turn => ({
        ...turn,
        // Convert Date object to ISO string for JSON serialization
        timestamp: turn.timestamp.toISOString(),
      })),
    };

    const jsonString = JSON.stringify(logData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.href = url;
    a.download = `live-api-logs-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <aside className={c('sidebar', { open: isSidebarOpen })}>
        <div className="sidebar-header">
          <h3>Configuración</h3>
          <button onClick={toggleSidebar} className="close-button">
            <span className="icon">close</span>
          </button>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-section">
            <fieldset disabled={connected}>
              {isEasterEggMode && (
                <label>
                  Persona
                  <select
                    value={activePersona}
                    onChange={e => setPersona(e.target.value)}
                  >
                    {Object.keys(personas).map(personaName => (
                      <option key={personaName} value={personaName}>
                        {personaName}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label>
                Instrucción del Sistema
                <textarea
                  value={systemPrompt}
                  onChange={e => setSystemPrompt(e.target.value)}
                  rows={10}
                  placeholder="Describe el rol y la personalidad de la IA..."
                  disabled={isEasterEggMode}
                />
              </label>
              <label>
                Modelo
                <select value={model} onChange={e => setModel(e.target.value)} disabled>
                  {/* This is an experimental model name that should not be removed from the options. */}
                  {AVAILABLE_MODELS.map(m => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Voz
                <select
                  value={voice}
                  onChange={e => setVoice(e.target.value)}
                  disabled={isEasterEggMode}
                >
                  {availableVoices.map(v => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.description})
                    </option>
                  ))}
                </select>
              </label>
            </fieldset>
            <div className="settings-toggle-item">
              <label className="tool-checkbox-wrapper">
                <input
                  type="checkbox"
                  id="system-message-toggle"
                  checked={showSystemMessages}
                  onChange={toggleShowSystemMessages}
                />
                <span className="checkbox-visual"></span>
              </label>
              <label
                htmlFor="system-message-toggle"
                className="settings-toggle-label"
              >
                Mostrar mensajes del sistema
              </label>
            </div>
          </div>
          <div className="sidebar-actions">
            <button onClick={handleExportLogs} title="Exportar registros de la sesión">
              <span className="icon">download</span>
              Exportar Registros
            </button>
            <button
              onClick={useLogStore.getState().clearTurns}
              title="Reiniciar registros de la sesión"
            >
              <span className="icon">refresh</span>
              Reiniciar Sesión
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
