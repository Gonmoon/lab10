import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import EditionList from '../components/editions/EditionList';
import EditionForm from '../components/editions/EditionForm';
import EditionDetail from '../components/editions/EditionDetail';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { createEdition, updateEdition, fetchEdition } from '../features/editions/editionsSlice';
import { EditionFormData } from '../api/editionsApi';

const EditionsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedEdition, loading } = useSelector((state: RootState) => state.editions);

  const handleCreate = async (values: EditionFormData) => {
    try {
      await dispatch(createEdition(values)).unwrap();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleUpdate = async (id: string, values: Partial<EditionFormData>) => {
    try {
      await dispatch(updateEdition({ id, data: values })).unwrap();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const EditEditionForm = () => {
    const { id } = useParams<{ id: string }>();

    React.useEffect(() => {
      if (id) dispatch(fetchEdition(id));
    }, [dispatch, id]);

    if (!selectedEdition || selectedEdition._id !== id) {
      return <div className="loading"><div className="spinner"></div></div>;
    }

    return (
      <EditionForm
        initialValues={selectedEdition}
        onSubmit={(values) => handleUpdate(id!, values)}
        isSubmitting={loading}
        title="Редактировать издание"
      />
    );
  };

  return (
    <Routes>
      <Route path="/" element={<EditionList />} />
      <Route path="/new" element={
        <EditionForm
          onSubmit={handleCreate}
          isSubmitting={loading}
          title="Добавить новое издание"
        />
      } />
      <Route path="/:id" element={<EditionDetail />} />
      <Route path="/:id/edit" element={<EditEditionForm />} />
      <Route path="*" element={<Navigate to="/editions" replace />} />
    </Routes>
  );
};

export default EditionsPage;
