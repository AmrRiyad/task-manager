import { DropdownSelector } from '@/components/ui/dropdown-selector';
import type { TaskPriority } from '@/types/task';
import { getPriorityColor, getPriorityLabel } from '@/utils/task-helpers';
import { Flag } from 'lucide-react-native';
import React, { memo, useMemo } from 'react';

interface PrioritySelectorProps {
  value: TaskPriority;
  onChange: (priority: TaskPriority) => void;
  textColor: string;
}

/**
 * Priority selector component for choosing task priority
 */
export const PrioritySelector = memo<PrioritySelectorProps>(({ value, onChange, textColor }) => {
  const priorities: TaskPriority[] = ['low', 'medium', 'high'];

  const options = useMemo(
    () =>
      priorities.map((priority) => ({
        value: priority,
        label: getPriorityLabel(priority),
        color: getPriorityColor(priority),
      })),
    []
  );

  return (
    <DropdownSelector
      icon={<Flag size={20} color={textColor} />}
      label="Priority"
      value={value}
      options={options}
      onChange={(newValue) => onChange(newValue as TaskPriority)}
    />
  );
});

PrioritySelector.displayName = 'PrioritySelector';

