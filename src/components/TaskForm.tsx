// src/components/TaskForm.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import {
  TextInput,
  Button,
  RadioButton,
  Text,
  HelperText,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
// Use just like @react-native-community/datetimepicker
import { Task } from '../store/tasksSlice';

interface TaskFormProps {
  initialValues?: Partial<Task>;
  onSubmit: (task: Partial<Task>) => void;
  loading?: boolean;
}

const priorityOptions: Array<{ label: string; value: Task['priority'] }> = [
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' },
];

export const TaskForm: React.FC<TaskFormProps> = ({
  initialValues = {},
  onSubmit,
  loading = false,
}) => {
  const [title, setTitle] = useState(initialValues.title ?? '');
  const [description, setDescription] = useState(initialValues.description ?? '');
  const [priority, setPriority] = useState<Task['priority']>(initialValues.priority ?? 'Medium');
  const [dueDate, setDueDate] = useState<Date>(
    initialValues.dueDate ? new Date(initialValues.dueDate) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [titleError, setTitleError] = useState(false);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDueDate(selectedDate);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setTitleError(true);
      return;
    }
    setTitleError(false);

    onSubmit({
      ...initialValues,
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate.toISOString(),
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Title"
        value={title}
        onChangeText={text => {
          setTitle(text);
          if (text.trim()) setTitleError(false);
        }}
        error={titleError}
        mode="outlined"
        accessibilityLabel="Task title"
      />
      <HelperText type="error" visible={titleError}>
        Title is required
      </HelperText>

      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        style={{ marginTop: 16 }}
        accessibilityLabel="Task description"
      />

      <View style={{ marginTop: 16 }}>
        <Text style={{ marginBottom: 8 }}>Due Date</Text>
        <Button
          mode="outlined"
          onPress={() => setShowDatePicker(true)}
          accessibilityLabel="Select due date"
        >
          {dueDate.toDateString()}
        </Button>
        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            onChange={onChangeDate}
            minimumDate={new Date()}
          />
        )}
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={{ marginBottom: 8 }}>Priority</Text>
        <RadioButton.Group onValueChange={newValue => setPriority(newValue as Task['priority'])} value={priority}>
          {priorityOptions.map(option => (
            <RadioButton.Item
              key={option.value}
              label={option.label}
              value={option.value}
              accessibilityLabel={`Priority ${option.label}`}
            />
          ))}
        </RadioButton.Group>
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={loading}
        style={{ marginTop: 24 }}
        accessibilityLabel="Save task"
        loading={loading}
      >
        Save
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    flexGrow: 1,
  },
});