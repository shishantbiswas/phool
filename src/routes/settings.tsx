import { createFileRoute } from '@tanstack/react-router'
import { db } from '../lib/dexie'
import { useLiveQuery } from 'dexie-react-hooks'

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  const settings = useLiveQuery(() => db.settings.get(1))

  if (settings === undefined) {
    db.settings.add({ 
      id: 1, 
      preferredColorScheme: 'light',
      shouldSaveHistory: true,
    })
  }

  const currentTheme = settings?.preferredColorScheme ?? 'light'
  const currentHistory = settings?.shouldSaveHistory ?? true

  function setColorTheme(e: React.ChangeEvent<HTMLSelectElement>) {
    db.settings.update(1,{ 
      preferredColorScheme: e.target.value,
      shouldSaveHistory: currentHistory 
    })
  }

  function disableHistoryToggle(e: React.ChangeEvent<HTMLSelectElement>) {
    db.settings.update(1,{ 
      shouldSaveHistory: e.target.value === 'true',
      preferredColorScheme: currentTheme 
    })
  }

  return (
  <div className="mt-4 p-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="flex flex-col justify-between gap-8 mt-12 max-w-3xl">
        <div className="flex justify-between items-center p-4 bg-(--color-base-200) rounded-(--radius-box)">
          <div>
            <p className="text-lg font-semibold">Switch Color Theme</p>
            <p className="text-sm opacity-70">Choose a theme that fits your style</p>
          </div>
          {<select 
            onChange={setColorTheme} 
            value={currentTheme}
            className="bg-(--color-base-100) border border-(--color-neutral) rounded-(--radius-field) p-2 min-w-[150px]"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="cyberpunk">Cyberpunk</option>
            <option value="retro">Retro</option>
            <option value="lofi">Lofi</option>
            <option value="aqua">Aqua</option>
            <option value="synthwave">Synthwave</option>
            <option value="garden">Garden</option>
            <option value="forest">Forest</option>
            <option value="pastel">Pastel</option>
            <option value="dracula">Dracula</option>
            <option value="coffee">Coffee</option>
            <option value="night">Night</option>
            <option value="dim">Dim</option>
            <option value="nord">Nord</option>
            <option value="sunset">Sunset</option>
          </select>}
        </div>

        <div className="flex justify-between items-center p-4 bg-(--color-base-200) rounded-(--radius-box)">
          <div>
            <p className="text-lg font-semibold">Save history</p>
            <p className="text-sm opacity-70">Keep a local history of your activity</p>
          </div>
          {<select 
            onChange={disableHistoryToggle} 
            value={currentHistory ? 'true' : 'false'}
            className="bg-(--color-base-100) border border-(--color-neutral) rounded-(--radius-field) p-2 min-w-[150px]"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>}
        </div>
      </div>
    </div>
)}