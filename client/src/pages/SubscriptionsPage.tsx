import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import SubscriptionList from '../components/subscriptions/SubscriptionList';
import SubscriptionForm from '../components/subscriptions/SubscriptionForm';
import SubscriptionDetail from '../components/subscriptions/SubscriptionDetail';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { createSubscription, updateSubscription, fetchSubscription, fetchSubscriptions } from '../features/subscriptions/subscriptionsSlice';
import { fetchRecipients } from '../features/recipients/recipientsSlice';
import { fetchEditions } from '../features/editions/editionsSlice';
import { SubscriptionFormData } from '../../api/subscriptionsApi';

const SubscriptionsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSubscription, loading } = useSelector(
    (state: RootState) => state.subscriptions
  );

  // Загружаем данные при монтировании компонента
  React.useEffect(() => {
    dispatch(fetchRecipients());
    dispatch(fetchEditions());
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  const handleCreate = async (values: SubscriptionFormData): Promise<boolean> => {
    try {
      await dispatch(createSubscription(values)).unwrap();
      return true;
    } catch (error) {
      console.error('Error creating subscription:', error);
      return false;
    }
  };

  const handleUpdate = async (id: string, values: Partial<SubscriptionFormData>): Promise<boolean> => {
    try {
      await dispatch(updateSubscription({ id, data: values })).unwrap();
      return true;
    } catch (error) {
      console.error('Error updating subscription:', error);
      return false;
    }
  };

  const EditSubscriptionForm = () => {
    const { id } = useParams<{ id: string }>();
    
    React.useEffect(() => {
      if (id) {
        dispatch(fetchSubscription(id));
      }
    }, [dispatch, id]);

    if (!selectedSubscription || selectedSubscription._id !== id) {
      return <div className="loading"><div className="spinner"></div></div>;
    }

    const formValues: SubscriptionFormData = {
      recipient: selectedSubscription.recipient._id,
      edition: selectedSubscription.edition._id,
      months: selectedSubscription.months,
      startMonth: selectedSubscription.startMonth,
      startYear: selectedSubscription.startYear,
    };

    return (
      <SubscriptionForm
        initialValues={formValues}
        onSubmit={(values) => handleUpdate(id!, values)}
        isSubmitting={loading}
        title="Редактировать подписку"
      />
    );
  };

  return (
    <Routes>
      <Route path="/" element={<SubscriptionList />} />
      <Route path="/new" element={
        <SubscriptionForm
          onSubmit={handleCreate}
          isSubmitting={loading}
          title="Добавить новую подписку"
        />
      } />
      <Route path="/:id" element={<SubscriptionDetail />} />
      <Route path="/:id/edit" element={<EditSubscriptionForm />} />
      <Route path="*" element={<Navigate to="/subscriptions" replace />} />
    </Routes>
  );
};

export default SubscriptionsPage;