import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, ScrollView } from 'react-native';
import {
  TextInput,
  Button,
  RadioButton,
  Text,
  useTheme,
  HelperText,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addTaskToDB, updateTaskInDB, Task } from '../../store/tasksSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskAddEdit'>;

const priorityOptions: Array<{ label: string; value: Task['priority'] }> = [
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' },
];

export const TaskAddEditScreen: React.FC<Props> = ({ route, navigation }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const editingTask: Task | undefined = route.params?.task;

  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [priority, setPriority] = useState<Task['priority']>(
    editingTask?.priority || 'Medium'
  );
  const [dueDate, setDueDate] = useState<Date>(
    editingTask ? new Date(editingTask.dueDate) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [titleError, setTitleError] = useState(false);

  const onSave = () => {
    if (!title.trim()) {
      setTitleError(true);
      return;
    }

    const newTask: Task = {
      id: editingTask?.id ?? uuidv4(),
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate.toISOString(),
      priority,
      status: editingTask?.status ?? 'Pending',
    };

    if (editingTask) {
      dispatch(updateTaskInDB(newTask));
    } else {
      dispatch(addTaskToDB(newTask));
    }
    navigation.goBack();
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDueDate(selectedDate);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
        <Text>Due Date</Text>
        <Button
          mode="outlined"
          onPress={() => setShowDatePicker(true)}
          accessibilityLabel="Choose due date"
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
        <Text>Priority</Text>
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
        onPress={onSave}
        style={{ marginTop: 24 }}
        accessibilityLabel="Save task"
      >
        Save
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: 'white', flexGrow: 1 },
});
