import { api } from '@/lib/api';
import type { Student, StudentsResponse } from '@/types/api';

export async function fetchStudents(): Promise<StudentsResponse> {
  const { data } = await api.get<StudentsResponse>('/students');
  return data;
}

export async function fetchStudent(studentId: string): Promise<Student> {
  const { data } = await api.get<Student>(`/students/${studentId}`);
  return data;
}
