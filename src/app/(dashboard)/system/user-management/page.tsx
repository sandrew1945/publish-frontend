import { UserListPage } from '@/components/user-management/user-list-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Management | Vibe Publish',
  description: 'Manage system users and their access.',
};

export default function UserManagementPage() {
  return (
    <div className="p-6">
      <UserListPage />
    </div>
  );
}
