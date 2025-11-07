import { DropdownSelector } from '@/components/ui/dropdown-selector';
import type { TaskStatus } from '@/types/task';
import { getStatusColor, getStatusLabel } from '@/utils/task-helpers';
import { Clock } from 'lucide-react-native';
import React, { memo, useMemo } from 'react';

interface StatusSelectorProps {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
  textColor: string;
}

/**
 * Status selector component for choosing task status
 */
export const StatusSelector = memo<StatusSelectorProps>(({ value, onChange, textColor }) => {
  const statuses: TaskStatus[] = ['todo', 'in progress', 'done'];

  const options = useMemo(
    () =>
      statuses.map((status) => ({
        value: status,
        label: getStatusLabel(status),
        color: getStatusColor(status),
      })),
    []
  );

  return (
    <DropdownSelector
      icon={<Clock size={20} color={textColor} />}
      label="Status"
      value={value}
      options={options}
      onChange={(newValue) => onChange(newValue as TaskStatus)}
    />
  );
});

StatusSelector.displayName = 'StatusSelector';

