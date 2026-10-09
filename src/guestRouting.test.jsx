import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import useStore from './store/useStore';

// اختبار انحدار: الزائر كان محصوراً في حلقة توجيه بين "/" (blockGuest)
// و "/login" (يعيد التوجيه لأن isAuthenticated يشمل الزائر) فتتجمّد الصفحة.
describe('توجيه الزائر — منع حلقة / و /login', () => {
  beforeEach(() => {
    useStore.setState({
      guestSession: {
        active: true,
        phone: 'زائر-9999',
        startedAt: Date.now(),
        expiresAt: Date.now() + 3600_000,
        warnedAt: null,
      },
      userRole: 'guest',
    });
  });

  it('يعرض نموذج الدخول للزائر على /login بدل تحويله إلى /', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText('دخول الزوار المؤقت')).toBeInTheDocument();
  });
});
