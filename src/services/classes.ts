import { api } from '@/lib/api';
import type {
  Class,
  ClassesResponse,
  EnrollStudentResponse,
  MessageResponse,
  StudentsResponse,
} from '@/types/api';

export async function fetchClasses(): Promise<Class[]> {
  const { data } = await api.get<ClassesResponse>('/classes');
  return data.data;
}

export async function fetchClass(classId: string): Promise<Class> {
  const { data } = await api.get<Class>(`/classes/${classId}`);
  return data;
}

export async function fetchClassStudents(
  classId: string,
  search?: string
) {
  const { data } = await api.get<StudentsResponse>(
    `/classes/${classId}/students`,
    { params: search ? { search } : undefined }
  );
  return data;
}

export async function enrollStudent(classId: string, studentId: string) {
  const { data } = await api.post<EnrollStudentResponse>(
    `/classes/${classId}/students`,
    { studentId }
  );
  return data;
}

export async function removeStudentFromClass(
  classId: string,
  studentId: string
) {
  const { data } = await api.delete<MessageResponse>(
    `/classes/${classId}/students/${studentId}`
  );
  return data;
}
