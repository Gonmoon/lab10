import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import RecipientList from '../components/recipients/RecipientList';
import RecipientForm from '../components/recipients/RecipientForm';
import RecipientDetail from '../components/recipients/RecipientDetail';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { createRecipient, updateRecipient, fetchRecipient } from '../features/recipients/recipientsSlice';
import { RecipientFormData } from '../api/recipientsApi';

const RecipientsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedRecipient, loading } = useSelector(
    (state: RootState) => state.recipients
  );

  const handleCreate = async (values: RecipientFormData): Promise<boolean> => {
    try {
      await dispatch(createRecipient(values)).unwrap();
      return true;
    } catch (error) {
      console.error('Error creating recipient:', error);
      return false;
    }
  };

  const handleUpdate = async (id: string, values: Partial<RecipientFormData>): Promise<boolean> => {
    try {
      await dispatch(updateRecipient({ id, data: values })).unwrap();
      return true;
    } catch (error) {
      console.error('Error updating recipient:', error);
      return false;
    }
  };

  const EditRecipientForm = () => {
    const { id } = useParams<{ id: string }>();
    
    React.useEffect(() => {
      if (id) {
        dispatch(fetchRecipient(id));
      }
    }, [dispatch, id]);

    if (loading || !selectedRecipient || selectedRecipient._id !== id) {
      return <div className="loading"><div className="spinner"></div></div>;
    }

    return (
      <RecipientForm
        initialValues={selectedRecipient}
        onSubmit={(values) => handleUpdate(id!, values)}
        isSubmitting={loading}
        title="Редактировать получателя"
      />
    );
  };

  return (
    <Routes>
      <Route path="/" element={<RecipientList />} />
      <Route path="/new" element={
        <RecipientForm
          onSubmit={handleCreate}
          isSubmitting={loading}
          title="Добавить нового получателя"
        />
      } />
      <Route path="/:id" element={<RecipientDetail />} />
      <Route path="/:id/edit" element={<EditRecipientForm />} />
      <Route path="*" element={<Navigate to="/recipients" replace />} />
    </Routes>
  );
};

export default RecipientsPage;
