import { clsx } from 'clsx';
import type { PrepCheckpoint } from '../api/schemas';

interface CheckItemProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

function CheckItem({ label, checked, onChange, disabled = false }: CheckItemProps) {
  return (
    <label
      className={clsx(
        'flex items-center gap-3 p-3 rounded-lg border cursor-pointer select-none transition-colors',
        checked ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200 hover:bg-slate-50',
        disabled && 'opacity-60 cursor-not-allowed',
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked)}
        disabled={disabled}
        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
      />
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {checked && <span className="ml-auto text-green-500 text-sm">✓</span>}
    </label>
  );
}

interface PrepChecklistCardProps {
  checkpoints: PrepCheckpoint;
  onChange: (updated: PrepCheckpoint) => void;
  disabled?: boolean;
  isSaving?: boolean;
}

const CHECKPOINT_LABELS: Record<keyof PrepCheckpoint, string> = {
  vehiclePulledAndReady: 'Vehicle pulled to front and ready',
  keysAvailable: 'Keys available and tagged',
  testDrivePathClear: 'Test drive path clear',
  locationConfirmed: 'Physical location confirmed',
  reconComplete: 'Recon complete',
};

export function PrepChecklistCard({
  checkpoints,
  onChange,
  disabled = false,
  isSaving = false,
}: PrepChecklistCardProps) {
  const keys = Object.keys(CHECKPOINT_LABELS) as Array<keyof PrepCheckpoint>;
  const completedCount = keys.filter((k) => checkpoints[k]).length;
  const allDone = completedCount === keys.length;

  function handleChange(key: keyof PrepCheckpoint, value: boolean): void {
    onChange({ ...checkpoints, [key]: value });
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm" data-testid="prep-checklist">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">Vehicle Preparation</h3>
        <div className="flex items-center gap-2">
          {isSaving && <span className="text-xs text-slate-400">Saving…</span>}
          <span
            className={clsx(
              'text-sm font-medium',
              allDone ? 'text-green-600' : 'text-slate-500',
            )}
          >
            {completedCount}/{keys.length} ready
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2">
        {keys.map((key) => (
          <CheckItem
            key={key}
            label={CHECKPOINT_LABELS[key]}
            checked={checkpoints[key]}
            onChange={(v) => handleChange(key, v)}
            disabled={disabled}
          />
        ))}
      </div>
      {allDone && (
        <div className="mx-4 mb-4 p-3 bg-green-50 rounded-lg text-sm text-green-700 font-medium text-center">
          Vehicle is fully ready for appointment
        </div>
      )}
    </div>
  );
}
