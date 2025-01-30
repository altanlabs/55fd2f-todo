import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTableSchema,
  createRecord,
  updateRecord,
  deleteRecord,
  selectTableRecords,
  selectIsLoading,
  selectTableSchema,
  selectSchemaLoading,
  TODOS_TABLE_ID,
  Record,
} from '@/redux/slices/tables';
import { DataTable } from './components/DataTable';
import { EditModal } from './components/EditModal';

export default function DatabaseExample() {
  const dispatch = useDispatch();
  const records = useSelector(selectTableRecords);
  const isLoading = useSelector(selectIsLoading);
  const schema = useSelector(selectTableSchema);
  const schemaLoading = useSelector(selectSchemaLoading);
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);

  useEffect(() => {
    dispatch(fetchTableSchema(TODOS_TABLE_ID));
  }, [dispatch]);

  const handleCreate = async (data: Partial<Record>) => {
    try {
      await dispatch(createRecord(TODOS_TABLE_ID, data));
    } catch (error) {
      console.error('Failed to create record:', error);
    }
  };

  const handleUpdate = async (id: number, data: Partial<Record['fields']>) => {
    try {
      await dispatch(updateRecord(TODOS_TABLE_ID, id, data));
      setEditingRecord(null);
    } catch (error) {
      console.error('Failed to update record:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteRecord(TODOS_TABLE_ID, id));
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  };

  if (schemaLoading || !schema) {
    return <div>Loading schema...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable
        data={records}
        isLoading={isLoading}
        onEdit={setEditingRecord}
        onDelete={handleDelete}
      />
      {editingRecord && (
        <EditModal
          record={editingRecord}
          onClose={() => setEditingRecord(null)}
          onSave={(data) => handleUpdate(editingRecord.id, data)}
        />
      )}
    </div>
  );
}